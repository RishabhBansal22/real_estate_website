import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

const SEED_PROPERTIES = [
  { 
    title: "Luxury 3BHK in Sector 62", 
    price: 15000000, 
    city: "Noida", 
    locality: "Sector 62", 
    location: "Sector 62, Noida", 
    beds: 3, 
    baths: 3, 
    sqft: 1800, 
    imageUrl: "https://images.unsplash.com/photo-1596893268413-db5b44aa6b75?auto=format&fit=crop&q=80&w=800", 
    type: "Apartment", 
    status: "Ready to Move",
    reraNumber: "RERA/UP/2026/12345",
    highlights: ["Near Metro", "Semi-Furnished", "Hot Deal"],
    amenities: ["Reserved Parking", "High Speed Lift", "24/7 CCTV Security", "Club House", "Power Backup"],
    nearby: [
      { name: "Indirapuram Public School", category: "School", distance: "5 min" },
      { name: "Sector 62 Metro Station", category: "Metro", distance: "8 min" },
      { name: "Fortis Hospital", category: "Hospital", distance: "12 min" }
    ],
    builder: { name: "Apex Group", experience: "20+ Years" },
    isVerified: true
  },
  { 
    title: "Sea-Facing Penthouse", 
    price: 85000000, 
    city: "Mumbai", 
    locality: "Worli", 
    location: "Worli, Mumbai", 
    beds: 4, 
    baths: 5, 
    sqft: 3500, 
    imageUrl: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&q=80&w=800", 
    type: "Apartment", 
    status: "Under Construction",
    reraNumber: "RERA/MH/2026/56789",
    highlights: ["Sea View", "Ultra-Luxury", "New"],
    amenities: ["Private Lift", "Infinity Pool", "3 Car Parking", "Concierge Service", "Smart Home Automation"],
    nearby: [
      { name: "Cathedral School", category: "School", distance: "15 min" },
      { name: "Worli Metro (Upcoming)", category: "Metro", distance: "5 min" },
      { name: "Lilavati Hospital", category: "Hospital", distance: "20 min" }
    ],
    builder: { name: "Lodha Group", experience: "40+ Years" },
    isVerified: true
  },
  { 
    title: "Premium Residential Plot", 
    price: 45000000, 
    city: "Delhi", 
    locality: "Vasant Vihar", 
    location: "Vasant Vihar, Delhi", 
    beds: 0, 
    baths: 0, 
    sqft: 4500, 
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", 
    type: "Plot", 
    status: "Ready to Move",
    reraNumber: "RERA/DL/2026/90123",
    highlights: ["Park Facing", "Corner Plot", "Hot Deal"],
    amenities: ["Gated Community", "Water Connection", "Electricity Point", "Wide Internal Roads"],
    nearby: [
      { name: "Modern School", category: "School", distance: "10 min" },
      { name: "Vasant Vihar Metro", category: "Metro", distance: "7 min" },
      { name: "Holy Family Hospital", category: "Hospital", distance: "18 min" }
    ],
    builder: { name: "DLF Premium", experience: "75+ Years" },
    isVerified: true
  },
  { 
    title: "Ultra-Luxury Smart Villa", 
    price: 120000000, 
    city: "Gurugram", 
    locality: "DLF Phase 5", 
    location: "DLF Phase 5, Gurugram", 
    beds: 5, 
    baths: 6, 
    sqft: 6000, 
    imageUrl: "https://images.unsplash.com/photo-1560448074-8f19ac5ea7ab?auto=format&fit=crop&q=80&w=800", 
    type: "Villa", 
    status: "Under Construction",
    reraNumber: "RERA/HR/2026/33445",
    highlights: ["Private Pool", "Smart Home", "New"],
    amenities: ["Private Lift", "4 Car Parking", "Advanced Security System", "Home Cinema", "Landscaped Garden"],
    nearby: [
      { name: "Heritage SchoolX", category: "School", distance: "5 min" },
      { name: "Golf Course Road Metro", category: "Metro", distance: "3 min" },
      { name: "Max Hospital", category: "Hospital", distance: "10 min" }
    ],
    builder: { name: "Emaar India", experience: "25+ Years" },
    isVerified: true
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-seed logic if the remote DB is completely empty!
    let count = await Property.countDocuments();
    
    // Migration check: If isVerified or status is missing, force re-seed
    if (count > 0) {
       const sampleProp = await Property.findOne();
       if (sampleProp.isVerified === undefined || sampleProp.status === undefined || sampleProp.reraNumber === undefined) {
          console.log("Deep Indian data missing. Migrating data...");
          await Property.deleteMany({});
          count = 0;
       }
    }

    if (count === 0) {
      console.log("Database empty or migrated. Seeding Indian properties...");
      await Property.insertMany(SEED_PROPERTIES);
    }

    // Sort by newest first
    const properties = await Property.find({}).sort({ createdAt: -1 });
    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch properties from MongoDB", error);
    return NextResponse.json({ message: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const data = await req.json();
    await connectToDatabase();

    const newProperty = await Property.create(data);
    
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create property in MongoDB", error);
    return NextResponse.json({ message: "Failed to create property" }, { status: 500 });
  }
}
