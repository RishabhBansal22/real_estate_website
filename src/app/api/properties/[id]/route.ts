import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function PUT(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }
    
    // In Next.js 15+, route parameters must be awaited or accessed carefully
    const { id } = await context.params;
    const data = await req.json();

    await connectToDatabase();
    
    const updatedProp = await Property.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedProp) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property updated successfully", property: updatedProp }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update property", error);
    return NextResponse.json({ message: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    
    await connectToDatabase();
    
    const deletedProp = await Property.findByIdAndDelete(id);
    
    if (!deletedProp) {
        return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete property", error);
    return NextResponse.json({ message: "Failed to delete property" }, { status: 500 });
  }
}
