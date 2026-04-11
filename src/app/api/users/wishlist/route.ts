import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email }).populate('savedProperties');
    
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Since we used populate, savedProperties will be an array of full property objects
    return NextResponse.json(currentUser.savedProperties || [], { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch wishlist", error);
    return NextResponse.json({ message: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
       return NextResponse.json({ message: "Property ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const propertyIndex = currentUser.savedProperties.indexOf(propertyId);
    let isSaved = false;

    if (propertyIndex === -1) {
      // Add to wishlist
      currentUser.savedProperties.push(propertyId);
      isSaved = true;
    } else {
      // Remove from wishlist
      currentUser.savedProperties.splice(propertyIndex, 1);
      isSaved = false;
    }

    await currentUser.save();

    return NextResponse.json({ isSaved, message: isSaved ? "Property saved." : "Property removed." }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to toggle wishlist", error);
    return NextResponse.json({ message: "Failed to toggle wishlist" }, { status: 500 });
  }
}
