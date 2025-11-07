"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import CareerForm from "@/lib/components/CareerComponents/CareerForm";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import FullScreenLoadingAnimation from "@/lib/components/CareerComponents/FullScreenLoadingAnimation";

export default function EditCareerPage() {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const step = searchParams.get("step");
    const { orgID } = useAppContext();
    const [career, setCareer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCareer = async () => {
            if (!slug || !orgID) return;
            try {
                const response = await axios.post("/api/career-data", {
                    id: slug,
                    orgID,
                });
                
                if (response.data) {
                    setCareer(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching career:", error);
                setLoading(false);
            }
        };

        fetchCareer();
    }, [orgID, slug]);

    if (loading) {
        return <FullScreenLoadingAnimation title="Loading..." subtext="Fetching career details..." />;
    }

    if (!career) {
        return (
            <>
                <HeaderBar activeLink="Careers" currentPage="Edit Career" icon="la la-suitcase" />
                <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
                    <div className="row">
                        <div className="col">
                            <p>Career not found</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Determine the last completed step
    const getLastCompletedStep = (career: any): number => {
        // If currentStep is saved in the database, use it (this is the saved progress)
        if (career.currentStep !== undefined && career.currentStep !== null && typeof career.currentStep === 'number') {
            return career.currentStep;
        }
        
        // Otherwise, calculate based on filled data
        // Step 1: Career Details & Team Access - check if basic info is filled
        if (!career.jobTitle || !career.description || !career.employmentType || !career.workSetup || !career.province || !career.location) {
            return 1;
        }
        
        // Step 2: CV Screening - check if screening setting exists
        if (!career.screeningSetting) {
            return 2;
        }
        
        // Step 3: AI Interview - check if questions exist
        if (!career.questions || career.questions.length === 0 || !career.questions.some((q: any) => q.questions && q.questions.length > 0)) {
            return 3;
        }
        
        // Step 4: Pipeline - always available if previous steps are done
        // Step 5: Review - always available if previous steps are done
        
        // If all steps are completed, return step 5 (Review)
        return 5;
    };

    const initialStep = step ? parseInt(step) : getLastCompletedStep(career);

    return (
        <>
            <HeaderBar activeLink="Careers" currentPage="Edit Career" icon="la la-suitcase" />
            <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
                <div className="row">
                    <CareerForm career={career} formType="edit" initialStep={initialStep} />
                </div>
            </div>
        </>
    );
}

