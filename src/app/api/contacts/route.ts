import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Verify user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    // Fetch all contacts with user and property data
    const contacts = await Contact.find({})
      .populate('userId', 'name email')
      .populate('propertyId', 'title location price')
      .sort({ createdAt: -1 });

    return NextResponse.json(contacts, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch contacts", error);
    return NextResponse.json({ message: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Verify user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { contactId, status } = await req.json();
    
    if (!contactId || !status || !['pending', 'contacted', 'resolved'].includes(status)) {
      return NextResponse.json({ message: "Invalid contact ID or status" }, { status: 400 });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    ).populate('userId').populate('propertyId');

    if (!contact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update contact", error);
    return NextResponse.json({ message: "Failed to update contact" }, { status: 500 });
  }
}
