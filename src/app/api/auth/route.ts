import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();
    const admin = await db.collection("admins").findOne({ email: email });

    if (admin) {
      await db.collection("admins").updateOne(
        { email: email },
        {
          $set: {
            name: name,
            image: image,
            lastSeen: new Date(),
          },
        }
      );

      return NextResponse.json(admin);
    } else {
      const applicant = await db
        .collection("applicants")
        .findOne({ email: email });

      if (applicant) {
        // Update last seen for existing applicant
        await db.collection("applicants").updateOne(
          { email: email },
          {
            $set: {
              name: name,
              image: image,
              lastSeen: new Date(),
            },
          }
        );
        return NextResponse.json(applicant);
      }

      // Create new applicant and return it
      const newApplicant = {
        email: email,
        name: name,
        image: image,
        createdAt: new Date(),
        lastSeen: new Date(),
        role: "applicant",
      };
      
      await db.collection("applicants").insertOne(newApplicant);
      return NextResponse.json(newApplicant);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
