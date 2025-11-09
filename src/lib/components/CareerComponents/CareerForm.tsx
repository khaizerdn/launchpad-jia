"use client"

import { useEffect, useRef, useState } from "react";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import CareerProgressBar from "./CareerProgressBar";
import CareerMemberDropdown from "@/lib/components/Dropdown/CareerMemberDropdown";
import CareerContentCareerDetails from "./CareerContentCareerDetails";
import CareerContentCVReview from "./CareerContentCVReview";
import CareerContentAIInterview from "./CareerContentAIInterview";
import CareerContentPipelineStages from "./CareerContentPipelineStages";
import CareerContentReviewCareer from "./CareerContentReviewCareer";
import styles from "@/lib/styles/components/careerForm.module.scss";
  // Setting List icons
  const screeningSettingList = [
    {
        name: "Good Fit and above",
        icon: "la la-check",
    },
    {
        name: "Only Strong Fit",
        icon: "la la-check-double",
    },
    {
        name: "No Automatic Promotion",
        icon: "la la-times",
    },
];
const workSetupOptions = [
    {
        name: "Fully Remote",
    },
    {
        name: "Onsite",
    },
    {
        name: "Hybrid",
    },
];

const employmentTypeOptions = [
    {
        name: "Full-Time",
    },
    {
        name: "Part-Time",
    },
];

export default function CareerForm({ career, formType, setShowEditModal, initialStep }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void, initialStep?: number }) {
    const { user, orgID } = useAppContext();
    const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
    const [description, setDescription] = useState(career?.description || "");
    const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
    const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
    const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || "Good Fit and above");
    const [cvSecretPrompt, setCvSecretPrompt] = useState(career?.cvSecretPrompt || "");
    const [aiInterviewSecretPrompt, setAiInterviewSecretPrompt] = useState(career?.aiInterviewSecretPrompt || "");
    const [interviewQuestions, setInterviewQuestions] = useState<{[category: string]: {id: string, text: string, isEditing: boolean}[]}>({
        'CV Validation / Experience': [],
        'Technical': [],
        'Behavioral': [],
        'Analytical': [],
        'Others': []
    });
    const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
    const [requireVideo, setRequireVideo] = useState(career?.requireVideo || true);
    const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable || true);
    const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary ? String(career.minimumSalary) : "");
    const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary ? String(career.maximumSalary) : "");
    const [preScreeningQuestions, setPreScreeningQuestions] = useState(career?.preScreeningQuestions || []);
    const [preScreeningQuestionOptions, setPreScreeningQuestionOptions] = useState(career?.preScreeningQuestionOptions || {});
    const [preScreeningQuestionSalaryRanges, setPreScreeningQuestionSalaryRanges] = useState(career?.preScreeningQuestionSalaryRanges || {});
    const [questions, setQuestions] = useState(career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 2,
        category: "Technical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 5,
        category: "Others",
        questionCountToAsk: null,
        questions: [],
      },
    ]);
    const [country, setCountry] = useState(career?.country || "Philippines");
    const [province, setProvince] = useState(career?.province || "");
    const [city, setCity] = useState(career?.location || "");
    const [showSaveModal, setShowSaveModal] = useState("");
    const [isSavingCareer, setIsSavingCareer] = useState(false);
    const savingCareerRef = useRef(false);
    const [currentStep, setCurrentStep] = useState(initialStep || 1);
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
    const [teamMembers, setTeamMembers] = useState(career?.teamMembers || []);

    // Initialize current user as Job Owner if no team members exist
    useEffect(() => {
        if (user && teamMembers.length === 0) {
            const currentUserMember = {
                id: user.id || Date.now(),
                name: user.name || "",
                email: user.email || "",
                role: "Job Owner",
                avatar: user.image || user.picture || "",
                isCurrentUser: true
            };
            setTeamMembers([currentUserMember]);
        }
    }, [user, teamMembers.length]);

    const isFormValid = () => {
        return jobTitle?.trim().length > 0 && description?.trim().length > 0 && questions.some((q) => q.questions.length > 0) && workSetup?.trim().length > 0;
    }

    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1:
                return jobTitle?.trim().length > 0 && 
                       description && description.replace(/<[^>]*>/g, '').trim().length > 0 && 
                       employmentType?.trim().length > 0 && 
                       workSetup?.trim().length > 0 && 
                       province?.trim().length > 0 && 
                       city?.trim().length > 0 && 
                       (minimumSalary?.trim().length > 0 || salaryNegotiable);
            case 2:
            case 3:
            case 4:
            case 5:
                return true; // Add validation for other steps as needed
            default:
                return false;
        }
    }

    const validateCurrentStep = () => {
        const errors: {[key: string]: string} = {};
        
        if (currentStep === 1) {
            if (!jobTitle?.trim().length) {
                errors.jobTitle = "Job title is required";
            }
            if (!description || !description.replace(/<[^>]*>/g, '').trim().length) {
                errors.description = "Job description is required";
            }
            if (!employmentType?.trim().length) {
                errors.employmentType = "Employment type is required";
            }
            if (!workSetup?.trim().length) {
                errors.workSetup = "Work arrangement is required";
            }
            if (!province?.trim().length) {
                errors.province = "Province is required";
            }
            if (!city?.trim().length) {
                errors.city = "City is required";
            }
            const minSalaryStr = minimumSalary ? String(minimumSalary).trim() : "";
            const maxSalaryStr = maximumSalary ? String(maximumSalary).trim() : "";
            
            if (!minSalaryStr.length) {
                errors.minimumSalary = "This is a required field.";
            } else if (Number(minimumSalary) === 0 || isNaN(Number(minimumSalary))) {
                errors.minimumSalary = "Minimum salary must be greater than 0";
            }
            if (!maxSalaryStr.length) {
                errors.maximumSalary = "This is a required field.";
            } else if (Number(maximumSalary) === 0 || isNaN(Number(maximumSalary))) {
                errors.maximumSalary = "Maximum salary must be greater than 0";
            } else if (minSalaryStr.length && Number(minimumSalary) > Number(maximumSalary)) {
                errors.maximumSalary = "Maximum salary must be greater than minimum salary";
            }
            if (!teamMembers.some(member => member.role === "Job Owner")) {
                errors.jobOwner = "Career must have a job owner. Please assign a job owner.";
            }
        }
        
        if (currentStep === 3) {
            const totalQuestions = Object.values(interviewQuestions).flat().length;
            if (totalQuestions < 5) {
                errors.interviewQuestions = "Please add at least 5 interview questions.";
            }
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSaveAndContinue = async () => {
        if (currentStep === 1 || currentStep === 3) {
            const isValid = validateCurrentStep();
            if (!isValid) {
                return; // Don't proceed if validation fails
            }
        }
        
        // Clear errors when moving to next step
        setFieldErrors({});
        
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else {
            // On the last step, save and publish
            if (formType === "add") {
                confirmSaveCareer("active");
            } else {
                updateCareer("active");
            }
        }
    }

    const updateCareer = async (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
            errorToast("Minimum salary cannot be greater than maximum salary", 1300);
            return;
        }
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const updatedCareer = {
            _id: career._id,
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            teamMembers,
            lastEditedBy: userInfoSlice,
            status,
            updatedAt: Date.now(),
            screeningSetting,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            employmentType,
            currentStep, // Save the current step progress
            preScreeningQuestions,
            preScreeningQuestionOptions,
            preScreeningQuestionSalaryRanges,
        }
        try {
            setIsSavingCareer(true);
            const response = await axios.post("/api/update-career", updatedCareer);
            if (response.status === 200) {
                candidateActionToast(
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career updated</span>
                    </div>,
                    1300,
                <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
                // Wait for the API call to complete before redirecting
                await new Promise(resolve => setTimeout(resolve, 1300));
                window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to update career", 1300);
            setIsSavingCareer(false);
        } finally {
            setIsSavingCareer(false);
        }
    }

  
    const confirmSaveCareer = (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
        errorToast("Minimum salary cannot be greater than maximum salary", 1300);
        return;
        }

        setShowSaveModal(status);
    }

    const saveCareer = async (status: string) => {
        setShowSaveModal("");
        if (!status) {
          return;
        }

        if (!savingCareerRef.current) {
        setIsSavingCareer(true);
        savingCareerRef.current = true;
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const career = {
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
            screeningSetting,
            orgID,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            status,
            employmentType,
            teamMembers,
            currentStep, // Save the current step progress
            preScreeningQuestions,
            preScreeningQuestionOptions,
            preScreeningQuestionSalaryRanges,
        }

        try {
            
            const response = await axios.post("/api/add-career", career);
            if (response.status === 200) {
            candidateActionToast(
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career added {status === "active" ? "and published" : ""}</span>
                </div>,
                1300, 
            <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
            setTimeout(() => {
                window.location.href = `/recruiter-dashboard/careers`;
            }, 1300);
            }
        } catch (error) {
            errorToast("Failed to add career", 1300);
        } finally {
            savingCareerRef.current = false;
            setIsSavingCareer(false);
        }
      }
    }


    return (
        <div className="col">
        {formType === "add" ? (<div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827", display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
                {currentStep > 1 && jobTitle?.trim() ? (
                  <>
                    <span style={{ color: "var(--Text-text-tertiary, #717680)" }}>[Draft]</span>
                    <span>{jobTitle}</span>
                  </>
                ) : (
                  "Add new career"
                )}
              </h1>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  <button
                  disabled={currentStep === 1 || isSavingCareer}
                   style={{ 
                     width: "fit-content", 
                     color: (currentStep === 1 || isSavingCareer) ? "var(--Button-text-secondary-disabled, #D5D7DA)" : "var(--Button-text-secondary, #414651)", 
                     background: "#fff", 
                     border: (currentStep === 1 || isSavingCareer) ? "1px solid var(--Button-border-primary_disabled, #E9EAEB)" : "1px solid var(--Button-border-primary, #D5D7DA)", 
                     padding: "8px 16px", 
                     borderRadius: "60px", 
                     cursor: (currentStep === 1 || isSavingCareer) ? "not-allowed" : "pointer", 
                     whiteSpace: "nowrap" 
                   }} onClick={() => {
                    confirmSaveCareer("inactive");
                      }}>
                          Save as Unpublished
                  </button>
                  <button 
                  style={{ width: "fit-content", background: "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap", display: "flex", flexDirection: "row", alignItems: "center", gap: 8, outline: "none" }} 
                  onFocus={(e) => e.target.style.outline = "none"}
                  onBlur={(e) => e.target.style.outline = "none"}
                  onClick={handleSaveAndContinue}>
                      {currentStep === 5 ? (
                          <>
                              <img alt="" src="/iconsV3/checkV8.svg" />
                              Publish
                          </>
                      ) : (
                          <>
                      Save and Continue
                      <i className="la la-arrow-right" style={{ color: "#fff", fontSize: 20 }}></i>
                          </>
                      )}
                  </button>
                </div>
        </div>) : null}
        <CareerProgressBar 
            isStep1Complete={currentStep > 1}
            isStep1Ready={
                jobTitle?.trim().length > 0 && 
                description && description.replace(/<[^>]*>/g, '').trim().length > 0 && 
                employmentType?.trim().length > 0 && 
                workSetup?.trim().length > 0 && 
                province?.trim().length > 0 && 
                city?.trim().length > 0 && 
                ((minimumSalary ? String(minimumSalary).trim().length > 0 : false) || salaryNegotiable)
            }
            currentStep={currentStep}
            hasStep1Errors={currentStep === 1 && Object.keys(fieldErrors).length > 0}
        />
        <div className={styles.contentDivider}></div>
        {formType === "edit" && (
            <div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Edit Career Details</h1>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <button
                 style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => {
                  if (setShowEditModal) {
                    setShowEditModal(false);
                  } else {
                    window.location.href = `/recruiter-dashboard/careers/manage/${career?._id}`;
                  }
                    }}>
                        Cancel
                </button>
                <button
                  disabled={currentStep === 1 || isSavingCareer}
                   style={{ 
                     width: "fit-content", 
                     color: (currentStep === 1 || isSavingCareer) ? "var(--Button-text-secondary-disabled, #D5D7DA)" : "var(--Button-text-secondary, #414651)", 
                     background: "#fff", 
                     border: (currentStep === 1 || isSavingCareer) ? "1px solid var(--Button-border-primary_disabled, #E9EAEB)" : "1px solid var(--Button-border-primary, #D5D7DA)", 
                     padding: "8px 16px", 
                     borderRadius: "60px", 
                     cursor: (currentStep === 1 || isSavingCareer) ? "not-allowed" : "pointer", 
                     whiteSpace: "nowrap" 
                   }} onClick={() => {
                    updateCareer("inactive");
                    }}>
                          Save as Unpublished
                  </button>
                  <button 
                  style={{ width: "fit-content", background: "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap", display: "flex", flexDirection: "row", alignItems: "center", gap: 8, outline: "none" }} 
                  onFocus={(e) => e.target.style.outline = "none"}
                  onBlur={(e) => e.target.style.outline = "none"}
                  onClick={handleSaveAndContinue}>
                      {currentStep === 5 ? (
                          <>
                              <img alt="" src="/iconsV3/checkV8.svg" />
                              Publish
                          </>
                      ) : (
                          <>
                      Save and Continue
                      <i className="la la-arrow-right" style={{ color: "#fff", fontSize: 20 }}></i>
                          </>
                      )}
                  </button>
              </div>
       </div>
        )}
        {currentStep === 1 && (
            <CareerContentCareerDetails
                jobTitle={jobTitle}
                setJobTitle={setJobTitle}
                description={description}
                setDescription={setDescription}
                workSetup={workSetup}
                setWorkSetup={setWorkSetup}
                employmentType={employmentType}
                setEmploymentType={setEmploymentType}
                country={country}
                setCountry={setCountry}
                province={province}
                setProvince={setProvince}
                city={city}
                setCity={setCity}
                minimumSalary={minimumSalary}
                setMinimumSalary={setMinimumSalary}
                maximumSalary={maximumSalary}
                setMaximumSalary={setMaximumSalary}
                salaryNegotiable={salaryNegotiable}
                setSalaryNegotiable={setSalaryNegotiable}
                teamMembers={teamMembers}
                setTeamMembers={setTeamMembers}
                screeningSetting={screeningSetting}
                setScreeningSetting={setScreeningSetting}
                requireVideo={requireVideo}
                setRequireVideo={setRequireVideo}
                screeningSettingList={screeningSettingList}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
            />
        )}
        {currentStep === 2 && (
            <CareerContentCVReview
                screeningSetting={screeningSetting}
                setScreeningSetting={setScreeningSetting}
                screeningSettingList={screeningSettingList}
                cvSecretPrompt={cvSecretPrompt}
                setCvSecretPrompt={setCvSecretPrompt}
                preScreeningQuestions={preScreeningQuestions}
                setPreScreeningQuestions={setPreScreeningQuestions}
                questionOptions={preScreeningQuestionOptions}
                setQuestionOptions={setPreScreeningQuestionOptions}
                questionSalaryRanges={preScreeningQuestionSalaryRanges}
                setQuestionSalaryRanges={setPreScreeningQuestionSalaryRanges}
            />
        )}
        {currentStep === 3 && (
            <CareerContentAIInterview
                screeningSetting={screeningSetting}
                setScreeningSetting={setScreeningSetting}
                screeningSettingList={screeningSettingList}
                requireVideo={requireVideo}
                setRequireVideo={setRequireVideo}
                aiInterviewSecretPrompt={aiInterviewSecretPrompt}
                setAiInterviewSecretPrompt={setAiInterviewSecretPrompt}
                interviewQuestions={interviewQuestions}
                setInterviewQuestions={setInterviewQuestions}
                fieldErrors={fieldErrors}
            />
        )}
        {currentStep === 4 && <CareerContentPipelineStages />}
        {currentStep === 5 && (
            <CareerContentReviewCareer
                jobTitle={jobTitle}
                employmentType={employmentType}
                workSetup={workSetup}
                country={country}
                province={province}
                city={city}
                minimumSalary={minimumSalary}
                maximumSalary={maximumSalary}
                salaryNegotiable={salaryNegotiable}
                description={description}
                teamMembers={teamMembers}
                screeningSetting={screeningSetting}
                cvSecretPrompt={cvSecretPrompt}
                preScreeningQuestions={preScreeningQuestions}
                preScreeningQuestionOptions={preScreeningQuestionOptions}
                preScreeningQuestionSalaryRanges={preScreeningQuestionSalaryRanges}
                requireVideo={requireVideo}
                aiInterviewSecretPrompt={aiInterviewSecretPrompt}
                interviewQuestions={interviewQuestions}
                pipelineStages={[]}
            />
        )}
      {showSaveModal && (
         <CareerActionModal action={showSaveModal} onAction={(action) => saveCareer(action)} />
        )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation title={formType === "add" ? "Saving career..." : "Updating career..."} subtext={`Please wait while we are ${formType === "add" ? "saving" : "updating"} the career`} />
      )}
    </div>
    )
}