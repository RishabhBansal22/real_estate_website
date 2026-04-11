import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can request the global user directory
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    
    // Pick specific non-sensitive fields
    const users = await User.find({}).select("name email role createdAt");

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch users", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
