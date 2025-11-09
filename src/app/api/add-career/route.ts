import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import {
  validateString,
  validateNumber,
  validateBoolean,
  validateArray,
  validateObjectId,
  validateUserObject,
  sanitizeHTML,
} from "@/lib/utils/validation";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // Validate and sanitize all string inputs
    const jobTitleValidation = validateString(requestData.jobTitle, "Job title", {
      required: true,
      maxLength: 200,
      allowHTML: false,
    });
    if (!jobTitleValidation.isValid) {
      return NextResponse.json({ error: jobTitleValidation.error }, { status: 400 });
    }

    const descriptionValidation = validateString(requestData.description, "Description", {
      required: true,
      maxLength: 50000,
      allowHTML: true, // Allow HTML for rich text editor
    });
    if (!descriptionValidation.isValid) {
      return NextResponse.json({ error: descriptionValidation.error }, { status: 400 });
    }

    const locationValidation = validateString(requestData.location, "Location", {
      required: true,
      maxLength: 200,
      allowHTML: false,
    });
    if (!locationValidation.isValid) {
      return NextResponse.json({ error: locationValidation.error }, { status: 400 });
    }

    const workSetupValidation = validateString(requestData.workSetup, "Work setup", {
      required: true,
      maxLength: 100,
      allowHTML: false,
    });
    if (!workSetupValidation.isValid) {
      return NextResponse.json({ error: workSetupValidation.error }, { status: 400 });
    }

    const workSetupRemarksValidation = validateString(requestData.workSetupRemarks, "Work setup remarks", {
      required: false,
      maxLength: 1000,
      allowHTML: false,
    });
    if (!workSetupRemarksValidation.isValid) {
      return NextResponse.json({ error: workSetupRemarksValidation.error }, { status: 400 });
    }

    const screeningSettingValidation = validateString(requestData.screeningSetting, "Screening setting", {
      required: false,
      maxLength: 100,
      allowHTML: false,
    });
    if (!screeningSettingValidation.isValid) {
      return NextResponse.json({ error: screeningSettingValidation.error }, { status: 400 });
    }

    const countryValidation = validateString(requestData.country, "Country", {
      required: false,
      maxLength: 100,
      allowHTML: false,
    });
    if (!countryValidation.isValid) {
      return NextResponse.json({ error: countryValidation.error }, { status: 400 });
    }

    const provinceValidation = validateString(requestData.province, "Province", {
      required: false,
      maxLength: 200,
      allowHTML: false,
    });
    if (!provinceValidation.isValid) {
      return NextResponse.json({ error: provinceValidation.error }, { status: 400 });
    }

    const employmentTypeValidation = validateString(requestData.employmentType, "Employment type", {
      required: false,
      maxLength: 50,
      allowHTML: false,
    });
    if (!employmentTypeValidation.isValid) {
      return NextResponse.json({ error: employmentTypeValidation.error }, { status: 400 });
    }

    // Validate numbers
    const minimumSalaryValidation = validateNumber(requestData.minimumSalary, "Minimum salary", {
      required: false,
      min: 0,
      integer: false,
    });
    if (!minimumSalaryValidation.isValid) {
      return NextResponse.json({ error: minimumSalaryValidation.error }, { status: 400 });
    }

    const maximumSalaryValidation = validateNumber(requestData.maximumSalary, "Maximum salary", {
      required: false,
      min: 0,
      integer: false,
    });
    if (!maximumSalaryValidation.isValid) {
      return NextResponse.json({ error: maximumSalaryValidation.error }, { status: 400 });
    }

    // Validate salary relationship
    if (
      minimumSalaryValidation.value !== null &&
      maximumSalaryValidation.value !== null &&
      minimumSalaryValidation.value > maximumSalaryValidation.value
    ) {
      return NextResponse.json(
        { error: "Minimum salary cannot be greater than maximum salary" },
        { status: 400 }
      );
    }

    const currentStepValidation = validateNumber(requestData.currentStep, "Current step", {
      required: false,
      min: 1,
      max: 5,
      integer: true,
    });
    if (!currentStepValidation.isValid) {
      return NextResponse.json({ error: currentStepValidation.error }, { status: 400 });
    }

    // Validate booleans
    const requireVideo = validateBoolean(requestData.requireVideo, "Require video", true);
    const salaryNegotiable = validateBoolean(requestData.salaryNegotiable, "Salary negotiable", true);

    // Validate status
    const statusValidation = validateString(requestData.status, "Status", {
      required: false,
      maxLength: 50,
      allowHTML: false,
    });
    if (!statusValidation.isValid) {
      return NextResponse.json({ error: statusValidation.error }, { status: 400 });
    }
    const validStatuses = ["active", "inactive"];
    const status = validStatuses.includes(statusValidation.value) ? statusValidation.value : "active";

    // Validate ObjectId
    const orgIDValidation = validateObjectId(requestData.orgID, "Organization ID", true);
    if (!orgIDValidation.isValid) {
      return NextResponse.json({ error: orgIDValidation.error }, { status: 400 });
    }

    // Validate questions array
    const questionsValidation = validateArray(requestData.questions, "Questions", {
      required: true,
    });
    if (!questionsValidation.isValid) {
      return NextResponse.json({ error: questionsValidation.error }, { status: 400 });
    }

    // Sanitize questions array (validate structure and sanitize strings)
    let sanitizedQuestions;
    try {
      sanitizedQuestions = questionsValidation.value.map((q: any, index: number) => {
        if (!q || typeof q !== 'object') {
          throw new Error(`Question at index ${index} must be an object`);
        }
        const categoryValidation = validateString(q.category || '', 'Category', { maxLength: 200 });
        if (!categoryValidation.isValid) {
          throw new Error(`Question category at index ${index}: ${categoryValidation.error}`);
        }
        return {
          id: typeof q.id === 'number' ? q.id : index + 1,
          category: categoryValidation.value,
          questionCountToAsk: q.questionCountToAsk != null ? Number(q.questionCountToAsk) : null,
          questions: Array.isArray(q.questions)
            ? q.questions.map((question: any, qIndex: number) => {
                const questionValidation = validateString(question, `Question at index ${qIndex}`, { maxLength: 1000 });
                if (!questionValidation.isValid) {
                  throw new Error(`Question at index ${qIndex}: ${questionValidation.error}`);
                }
                return questionValidation.value;
              })
            : [],
        };
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid questions format' },
        { status: 400 }
      );
    }

    // Validate team members array
    const teamMembersValidation = validateArray(requestData.teamMembers, "Team members", {
      required: false,
    });
    if (!teamMembersValidation.isValid) {
      return NextResponse.json({ error: teamMembersValidation.error }, { status: 400 });
    }

    // Sanitize team members
    let sanitizedTeamMembers;
    try {
      sanitizedTeamMembers = teamMembersValidation.value.map((member: any, index: number) => {
        if (!member || typeof member !== 'object') {
          throw new Error(`Team member at index ${index} must be an object`);
        }
        const nameValidation = validateString(member.name || '', 'Member name', { maxLength: 200 });
        if (!nameValidation.isValid) {
          throw new Error(`Team member name at index ${index}: ${nameValidation.error}`);
        }
        const emailValidation = validateString(member.email || '', 'Member email', { maxLength: 200 });
        if (!emailValidation.isValid) {
          throw new Error(`Team member email at index ${index}: ${emailValidation.error}`);
        }
        const roleValidation = validateString(member.role || '', 'Member role', { maxLength: 100 });
        if (!roleValidation.isValid) {
          throw new Error(`Team member role at index ${index}: ${roleValidation.error}`);
        }
        return {
          id: typeof member.id === 'number' ? member.id : index + 1,
          name: nameValidation.value,
          email: emailValidation.value,
          role: roleValidation.value,
          avatar: member.avatar ? validateString(member.avatar, 'Avatar', { maxLength: 500 }).value : '',
          avatarColor: member.avatarColor ? validateString(member.avatarColor, 'Avatar color', { maxLength: 20 }).value : '',
          isCurrentUser: validateBoolean(member.isCurrentUser, 'Is current user', false),
        };
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid team members format' },
        { status: 400 }
      );
    }

    // Validate user objects
    const lastEditedByValidation = validateUserObject(requestData.lastEditedBy, "Last edited by");
    if (!lastEditedByValidation.isValid) {
      return NextResponse.json({ error: lastEditedByValidation.error }, { status: 400 });
    }

    const createdByValidation = validateUserObject(requestData.createdBy, "Created by");
    if (!createdByValidation.isValid) {
      return NextResponse.json({ error: createdByValidation.error }, { status: 400 });
    }

    // Validate pre-screening questions (optional)
    const preScreeningQuestionsValidation = validateArray(requestData.preScreeningQuestions, "Pre-screening questions", {
      required: false,
    });
    const preScreeningQuestions = preScreeningQuestionsValidation.isValid ? (preScreeningQuestionsValidation.value || []) : [];

    // Validate pre-screening question options (optional)
    const preScreeningQuestionOptions = requestData.preScreeningQuestionOptions && typeof requestData.preScreeningQuestionOptions === 'object' 
      ? requestData.preScreeningQuestionOptions 
      : {};

    // Validate pre-screening question salary ranges (optional)
    const preScreeningQuestionSalaryRanges = requestData.preScreeningQuestionSalaryRanges && typeof requestData.preScreeningQuestionSalaryRanges === 'object'
      ? requestData.preScreeningQuestionSalaryRanges
      : {};

    // Extract validated values
    const {
      jobTitle,
      description,
      location,
      workSetup,
      workSetupRemarks,
      screeningSetting,
      orgID,
      country,
      province,
      employmentType,
      minimumSalary,
      maximumSalary,
      currentStep,
      teamMembers,
      lastEditedBy,
      createdBy,
      status: validatedStatus,
    } = {
      jobTitle: jobTitleValidation.value,
      description: descriptionValidation.value,
      location: locationValidation.value,
      workSetup: workSetupValidation.value,
      workSetupRemarks: workSetupRemarksValidation.value,
      screeningSetting: screeningSettingValidation.value,
      orgID: orgIDValidation.value!,
      country: countryValidation.value,
      province: provinceValidation.value,
      employmentType: employmentTypeValidation.value,
      minimumSalary: minimumSalaryValidation.value,
      maximumSalary: maximumSalaryValidation.value,
      currentStep: currentStepValidation.value || 1,
      teamMembers: sanitizedTeamMembers,
      lastEditedBy: lastEditedByValidation.value,
      createdBy: createdByValidation.value,
      status: status, // This is the validated status from above
    };

    const { db } = await connectMongoDB();

    const orgDetails = await db.collection("organizations").aggregate([
      {
        $match: {
          _id: new ObjectId(orgID)
        }
      },
      {
        $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
                {
                    $addFields: {
                        _id: { $toString: "$_id" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$planId"] }
                    }
                }
            ],
            as: "plan"
        }
      },
      {
        $unwind: "$plan"
      },
    ]).toArray();

    if (!orgDetails || orgDetails.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

    if (totalActiveCareers >= (orgDetails[0].plan.jobLimit + (orgDetails[0].extraJobSlots || 0))) {
      return NextResponse.json({ error: "You have reached the maximum number of jobs for your plan" }, { status: 400 });
    }

    const career = {
      id: guid(),
      jobTitle,
      description, // Already sanitized HTML
      questions: sanitizedQuestions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: validatedStatus || "active",
      screeningSetting: screeningSetting || "Good Fit and above",
      orgID,
      requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country: country || "Philippines",
      province,
      employmentType,
      currentStep: currentStep,
      teamMembers: teamMembers,
      preScreeningQuestions,
      preScreeningQuestionOptions,
      preScreeningQuestionSalaryRanges,
    };

    await db.collection("careers").insertOne(career);

    return NextResponse.json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
