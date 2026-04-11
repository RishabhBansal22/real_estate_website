import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ url: '/properties' }, { status: 200 });
    }

    const lowerQuery = query.toLowerCase();
    
    // Our NLP Pattern Recognition Variables
    let extractedLocation = "";
    let extractedMaxPrice = "";
    let extractedType = "";

    // 1. Price Parser (e.g. "under 50L", "below 1.5Cr", "max 2000000")
    // Detects "L" or "lakh" or "cr" or "crore"
    const priceMatch = lowerQuery.match(/(?:under|below|max)?\s*₹?(\d+(?:\.\d+)?)\s*(l|lakh|cr|crore|k|m)/i);
    if (priceMatch) {
      const amount = parseFloat(priceMatch[1]);
      const suffix = priceMatch[2].toLowerCase();
      
      let finalAmount = amount;
      if (suffix.startsWith('l')) finalAmount = amount * 100000; // Lakhs to absolute
      else if (suffix.startsWith('cr')) finalAmount = amount * 10000000; // Crores to absolute
      else if (suffix === 'k') finalAmount = amount * 1000;
      else if (suffix === 'm') finalAmount = amount * 1000000;
      
      extractedMaxPrice = finalAmount.toString();
    } else {
      // Direct numbers "under 5000000"
      const directPriceMatch = lowerQuery.match(/(?:under|below|max)\s*₹?(\d{4,})/i);
      if (directPriceMatch) extractedMaxPrice = directPriceMatch[1];
    }

    // 2. Location Parser (e.g. "in Mumbai", "around Delhi")
    const words = lowerQuery.split(/\s+/);
    const inIndex = words.indexOf('in');
    const atIndex = words.indexOf('at');
    const aroundIndex = words.indexOf('around');
    
    let locationStartIdx = -1;
    if (inIndex !== -1) locationStartIdx = inIndex;
    else if (atIndex !== -1) locationStartIdx = atIndex;
    else if (aroundIndex !== -1) locationStartIdx = aroundIndex;

    if (locationStartIdx !== -1 && locationStartIdx + 1 < words.length) {
      // Grab the next 1-2 words as location assumption
      extractedLocation = words[locationStartIdx + 1];
    }

    // 3. Type Parser ("villa", "land", "plot", "house", "farm")
    if (lowerQuery.includes('villa')) extractedType = 'villa';
    else if (lowerQuery.includes('house') || lowerQuery.includes('home')) extractedType = 'house';
    else if (lowerQuery.includes('land') || lowerQuery.includes('plot') || lowerQuery.includes('farm')) extractedType = 'land';
    else if (lowerQuery.includes('commercial')) extractedType = 'commercial';

    // Construct Redirect URL Params
    const params = new URLSearchParams();
    if (extractedLocation) params.append('location', extractedLocation.toLowerCase());
    if (extractedMaxPrice) params.append('maxPrice', extractedMaxPrice);
    if (extractedType) params.append('type', extractedType.toLowerCase());

    const queryString = params.toString();
    const finalUrl = `/properties${queryString ? `?${queryString}` : ''}`;

    return NextResponse.json({ 
      url: finalUrl,
      parsed: { location: extractedLocation, maxPrice: extractedMaxPrice, type: extractedType }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "AI Engine Processing Failed", url: '/properties' }, { status: 500 });
  }
}
