import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { careerId } = await request.json();

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const career = await db.collection("careers").findOne(
      { id: careerId },
      {
        projection: {
          preScreeningQuestions: 1,
          preScreeningQuestionOptions: 1,
          preScreeningQuestionSalaryRanges: 1,
        },
      }
    );

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preScreeningQuestions: career.preScreeningQuestions || [],
      preScreeningQuestionOptions: career.preScreeningQuestionOptions || {},
      preScreeningQuestionSalaryRanges: career.preScreeningQuestionSalaryRanges || {},
    });
  } catch (error) {
    console.error("Error fetching pre-screening questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch pre-screening questions" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const careerId = searchParams.get("careerId");

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID is required as query parameter" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const career = await db.collection("careers").findOne(
      { id: careerId },
      {
        projection: {
          preScreeningQuestions: 1,
          preScreeningQuestionOptions: 1,
          preScreeningQuestionSalaryRanges: 1,
        },
      }
    );

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preScreeningQuestions: career.preScreeningQuestions || [],
      preScreeningQuestionOptions: career.preScreeningQuestionOptions || {},
      preScreeningQuestionSalaryRanges: career.preScreeningQuestionSalaryRanges || {},
    });
  } catch (error) {
    console.error("Error fetching pre-screening questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch pre-screening questions" },
      { status: 500 }
    );
  }
}

