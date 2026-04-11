import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    await connectToDatabase();

    // Autocomplete Logic: Match location, title, or type using Regex for flexibility
    const queryRegex = new RegExp(query, 'i');
    
    const properties = await Property.find({
      $or: [
        { city: { $regex: queryRegex } },
        { locality: { $regex: queryRegex } },
        { location: { $regex: queryRegex } },
        { title: { $regex: queryRegex } },
        { type: { $regex: queryRegex } }
      ]
    }).limit(5);
    
    const suggestions = properties.map((p: any) => ({
      id: p.id,
      text: `${p.title} in ${p.locality ? `${p.locality}, ${p.city}` : p.location}`, // formatted string for dropdown
      location: p.locality ? `${p.locality}, ${p.city}` : p.location,
      type: p.type
    }));

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch suggestions", error);
    return NextResponse.json({ message: "Failed to fetch suggestions" }, { status: 500 });
  }
}
