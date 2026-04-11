import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // The first user created might default to admin, or we can just leave it as 'user'
    // We'll let the DB define the default role ('user')
    const userRole = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error", error);
    return NextResponse.json({ message: "Registration failed. Please try again." }, { status: 500 });
  }
}
