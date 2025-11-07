"use client"

import { useEffect, useRef, useState } from "react";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import CareerProgressBar from "./CareerProgressBar";
import MemberDropdown from "./MemberDropdown";
import CareerContentDetails from "./CareerContentDetails";
import CareerContentScreening from "./CareerContentScreening";
import CareerContentInterview from "./CareerContentInterview";
import CareerContentPipeline from "./CareerContentPipeline";
import CareerContentReview from "./CareerContentReview";
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

export default function CareerForm({ career, formType, setShowEditModal }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void }) {
    const { user, orgID } = useAppContext();
    const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
    const [description, setDescription] = useState(career?.description || "");
    const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
    const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
    const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || "Good Fit and above");
    const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
    const [requireVideo, setRequireVideo] = useState(career?.requireVideo || true);
    const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable || true);
    const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary || "");
    const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary || "");
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
    const [currentStep, setCurrentStep] = useState(1);
    const [teamMembers, setTeamMembers] = useState(career?.teamMembers || [
        {
            id: 1,
            name: "Sabine Beatrix Dy",
            email: "sabine@whitecloak.com",
            role: "Job Owner",
            avatar: "",
            isCurrentUser: true
        },
        {
            id: 2,
            name: "Darlene Santo Tomas",
            email: "darlene@whitecloak.com",
            role: "Contributor",
            avatar: "",
            isCurrentUser: false
        }
    ]);

    const isFormValid = () => {
        return jobTitle?.trim().length > 0 && description?.trim().length > 0 && questions.some((q) => q.questions.length > 0) && workSetup?.trim().length > 0;
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
                setTimeout(() => {
                    window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
                }, 1300);
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to update career", 1300);
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
              <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Add new career</h1>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  <button
                  disabled={!isFormValid() || isSavingCareer}
                   style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                    confirmSaveCareer("inactive");
                      }}>
                          Save as Unpublished
                  </button>
                  <button 
                  disabled={!isFormValid() || isSavingCareer}
                  style={{ width: "fit-content", background: !isFormValid() || isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                    confirmSaveCareer("active");
                  }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                      Save as Published
                  </button>
                </div>
        </div>) : null}
        {formType === "add" && <CareerProgressBar 
            isStep1Complete={
                jobTitle?.trim().length > 0 && 
                description && description.replace(/<[^>]*>/g, '').trim().length > 0 && 
                employmentType?.trim().length > 0 && 
                workSetup?.trim().length > 0 && 
                province?.trim().length > 0 && 
                city?.trim().length > 0 && 
                (minimumSalary?.trim().length > 0 || salaryNegotiable)
            }
            currentStep={currentStep}
            onStepClick={setCurrentStep}
        />}
        {formType === "add" && <div className={styles.contentDivider}></div>}
        {formType === "edit" && (
            <div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Edit Career Details</h1>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <button
                 style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => {
                  setShowEditModal?.(false);
                    }}>
                        Cancel
                </button>
                <button
                  disabled={!isFormValid() || isSavingCareer}
                   style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                    updateCareer("inactive");
                    }}>
                          Save Changes as Unpublished
                  </button>
                  <button 
                  disabled={!isFormValid() || isSavingCareer}
                  style={{ width: "fit-content", background: !isFormValid() || isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                    updateCareer("active");
                  }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                      Save Changes as Published
                  </button>
              </div>
       </div>
        )}
        {formType === "add" ? (
            <>
                {currentStep === 1 && (
                    <CareerContentDetails
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
                    />
                )}
                {currentStep === 2 && (
                    <CareerContentScreening
                        screeningSetting={screeningSetting}
                        setScreeningSetting={setScreeningSetting}
                        screeningSettingList={screeningSettingList}
                    />
                )}
                {currentStep === 3 && (
                    <CareerContentInterview
                        screeningSetting={screeningSetting}
                        setScreeningSetting={setScreeningSetting}
                        screeningSettingList={screeningSettingList}
                        requireVideo={requireVideo}
                        setRequireVideo={setRequireVideo}
                    />
                )}
                {currentStep === 4 && <CareerContentPipeline />}
                {currentStep === 5 && <CareerContentReview />}
            </>
        ) : (
            <CareerContentDetails
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