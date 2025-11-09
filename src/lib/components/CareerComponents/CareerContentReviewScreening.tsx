"use client"

import { useState } from "react";
import styles from "@/lib/styles/components/careerForm.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";

interface CareerContentReviewScreeningProps {
    screeningSetting?: string;
    cvSecretPrompt?: string;
    preScreeningQuestions?: any[];
    preScreeningQuestionOptions?: {[questionId: string]: {id: string, value: string, number: number}[]};
    preScreeningQuestionSalaryRanges?: {[questionId: string]: {minimum: string, maximum: string}};
}

export default function CareerContentReviewScreening({
    screeningSetting = "",
    cvSecretPrompt = "",
    preScreeningQuestions = [],
    preScreeningQuestionOptions = {},
    preScreeningQuestionSalaryRanges = {},
}: CareerContentReviewScreeningProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const formatSecretPrompt = (html: string) => {
        if (!html) return [];
        // Remove HTML tags and decode entities
        if (typeof window !== "undefined") {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const text = tempDiv.textContent || tempDiv.innerText || "";
            // Split by line breaks or bullet points
            return text.split(/\n|•|·/).filter(item => item.trim().length > 0);
        }
        // Fallback for SSR: simple regex to remove HTML tags
        const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
        return text.split(/\n|•|·/).filter(item => item.trim().length > 0);
    };

    const getQuestionOptions = (questionId: string) => {
        return preScreeningQuestionOptions[questionId] || [];
    };

    const getSalaryRange = (questionId: string) => {
        return preScreeningQuestionSalaryRanges[questionId];
    };

    const formatQuestionValue = (question: any) => {
        const questionId = question.id;
        const questionType = question.type || "Dropdown";
        const options = getQuestionOptions(questionId);
        const salaryRange = getSalaryRange(questionId);

        if (questionType === "Range" && salaryRange) {
            return `Preferred: PHP ${Number(salaryRange.minimum).toLocaleString()} - PHP ${Number(salaryRange.maximum).toLocaleString()}`;
        }
        return options.map(opt => opt.value).join(", ");
    };

    return (
        <div className={styles.mainContentContainer}>
            <div className={cardStyles.careerCard} style={{ width: "960px" }}>
                <div className={cardStyles.careerCardHeader} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div 
                            style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <svg 
                                width="12" 
                                height="7" 
                                viewBox="0 0 12 7" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                            >
                                <path d="M0.833984 0.833328L5.83398 5.83333L10.834 0.833328" stroke="#717680" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>CV Review & Pre-screening</span>
                    </div>
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--Button-bg-secondary, #ffffff)", border: "1px solid var(--Button-border-primary, #d5d7da)", borderRadius: "50%", cursor: "pointer" }}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpanded && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                        {/* CV Screening */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                            <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>CV Screening</div>
                            <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                Automatically endorse candidates who are {(() => {
                                    if (!screeningSetting) return "—";
                                    // Extract first part (e.g., "Good Fit") and the rest (e.g., "and above")
                                    const parts = screeningSetting.split(" and ");
                                    const firstPart = parts[0] || screeningSetting;
                                    const rest = parts.length > 1 ? " and " + parts.slice(1).join(" and ") : "";
                                    return (
                                        <>
                                            <span style={{ 
                                                display: "inline-block", 
                                                paddingTop: "2px", 
                                                paddingRight: "10px", 
                                                paddingBottom: "2px", 
                                                paddingLeft: "10px", 
                                                width: "fit-content", 
                                                height: "24px", 
                                                background: "var(--Colors-Secondary_Colors-Blue-50, #EFF8FF)", 
                                                border: "1px solid var(--Colors-Secondary_Colors-Blue-200, #B2DDFF)", 
                                                borderRadius: "16px", 
                                                fontFamily: "inherit", 
                                                fontWeight: 700, 
                                                fontStyle: "normal", 
                                                fontSize: "14px", 
                                                lineHeight: "20px", 
                                                letterSpacing: "0%", 
                                                textAlign: "center", 
                                                color: "var(--Colors-Secondary_Colors-Blue-700, #175CD3)" 
                                            }}>{firstPart}</span>
                                            {rest}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* CV Secret Prompt */}
                        {cvSecretPrompt && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <img alt="" src="/iconsV3/sparkle.svg" />
                                        <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>CV Secret Prompt</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: "20px", fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                        {formatSecretPrompt(cvSecretPrompt).map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Pre-Screening Questions */}
                        {preScreeningQuestions.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Pre-Screening Questions</div>
                                    <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "2px 8px", width: "22px", height: "22px", background: "var(--Colors-Secondary_Colors-Blue-gray-50, #F8F9FC)", border: "1px solid var(--Colors-Secondary_Colors-Blue-gray-200, #D5D9EB)", borderRadius: "16px", fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "12px", lineHeight: "18px", letterSpacing: "0%", textAlign: "center", color: "var(--Colors-Secondary_Colors-Blue-gray-700, #363F72)" }}>
                                        {preScreeningQuestions.length}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {preScreeningQuestions.map((question, index) => {
                                        const questionId = question.id;
                                        const questionType = question.type || "Dropdown";
                                        const options = getQuestionOptions(questionId);
                                        const salaryRange = getSalaryRange(questionId);
                                        
                                        return (
                                            <div key={question.id} style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                                <strong>{index + 1}. {question.description || question.title || `Question ${index + 1}`}</strong>
                                                {questionType === "Range" && salaryRange ? (
                                                    <ul style={{ margin: 0, paddingLeft: "40px", display: "flex", flexDirection: "column", gap: "var(--spacing-xs, 8px)" }}>
                                                        <li style={{ marginBottom: 0 }}>
                                                            Preferred: PHP {Number(salaryRange.minimum).toLocaleString()} - PHP {Number(salaryRange.maximum).toLocaleString()}
                                                        </li>
                                                    </ul>
                                                ) : options.length > 0 ? (
                                                    <ul style={{ margin: 0, paddingLeft: "40px", display: "flex", flexDirection: "column", gap: "var(--spacing-xs, 8px)" }}>
                                                        {options.map((option: any) => (
                                                            <li key={option.id} style={{ marginBottom: 0 }}>{option.value}</li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

