import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { careerID, careerId, preScreeningOnly } = body;

    if (!careerID && !careerId) {
      return NextResponse.json(
        { error: "careerID or careerId is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    // Try to find by MongoDB _id first, then by GUID id
    let career;
    if (careerID && ObjectId.isValid(careerID)) {
      career = await db
        .collection("careers")
        .findOne({ _id: new ObjectId(careerID) });
    } else if (careerId) {
      career = await db
        .collection("careers")
        .findOne({ id: careerId });
    } else if (careerID) {
      // Fallback: try as GUID id
      career = await db
        .collection("careers")
        .findOne({ id: careerID });
    }

    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    if (career.status === "inactive") {
      return NextResponse.json(
        { error: "Career is inactive" },
        { status: 403 }
      );
    }

    // Check if this is a request for pre-screening questions only
    if (preScreeningOnly) {
      return NextResponse.json({
        preScreeningQuestions: career.preScreeningQuestions || [],
        preScreeningQuestionOptions: career.preScreeningQuestionOptions || {},
        preScreeningQuestionSalaryRanges: career.preScreeningQuestionSalaryRanges || {},
      });
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career data" },
      { status: 500 }
    );
  }
}
