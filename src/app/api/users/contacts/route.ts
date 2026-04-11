import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email }).populate({
      path: 'contactHistory',
      populate: { path: 'propertyId' }
    });
    
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(currentUser.contactHistory || [], { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch contact history", error);
    return NextResponse.json({ message: "Failed to fetch contact history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, email, phone, message, subject, propertyId } = await req.json();
    
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create new contact
    const newContact = await Contact.create({
      userId: currentUser._id,
      propertyId: propertyId || null,
      firstName,
      lastName,
      email,
      phone,
      message,
      subject: subject || 'General Inquiry',
      status: 'pending'
    });

    // Add contact to user's contact history
    currentUser.contactHistory.push(newContact._id);
    await currentUser.save();

    const populatedContact = await newContact.populate('propertyId');

    return NextResponse.json(populatedContact, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create contact", error);
    return NextResponse.json({ message: "Failed to create contact" }, { status: 500 });
  }
}

// PATCH endpoint to update contact status
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contactId, status } = await req.json();
    
    if (!contactId || !status || !['pending', 'contacted', 'resolved'].includes(status)) {
      return NextResponse.json({ message: "Invalid contact ID or status" }, { status: 400 });
    }

    await connectToDatabase();
    
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    ).populate('propertyId');

    if (!contact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update contact", error);
    return NextResponse.json({ message: "Failed to update contact" }, { status: 500 });
  }
}
