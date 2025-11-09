"use client"

import { useState } from "react";
import styles from "@/lib/styles/components/careerForm.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";

interface CareerContentReviewInterviewProps {
    screeningSetting?: string;
    requireVideo?: boolean;
    aiInterviewSecretPrompt?: string;
    interviewQuestions?: {[category: string]: {id: string, text: string, isEditing: boolean}[]};
}

export default function CareerContentReviewInterview({
    screeningSetting = "",
    requireVideo = false,
    aiInterviewSecretPrompt = "",
    interviewQuestions = {},
}: CareerContentReviewInterviewProps) {
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

    const getTotalQuestions = () => {
        return Object.values(interviewQuestions).reduce((total, questions) => total + (questions?.length || 0), 0);
    };

    const categories = ['CV Validation / Experience', 'Technical', 'Behavioral', 'Analytical', 'Others'];

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
                        <span className={cardStyles.careerCardTitle}>AI Interview Setup</span>
                    </div>
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--Button-bg-secondary, #ffffff)", border: "1px solid var(--Button-border-primary, #d5d7da)", borderRadius: "50%", cursor: "pointer" }}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpanded && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                        {/* AI Interview Screening */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                            <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>AI Interview Screening</div>
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

                        {/* Require Video on Interview */}
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Require Video on Interview</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                    {requireVideo ? "Yes" : "No"}
                                </div>
                                {requireVideo && (
                                    <div style={{ width: "24px", height: "24px", borderRadius: "16px", borderWidth: "1px", padding: "6px", background: "var(--Colors-Primary_Colors-Success-50, #ECFDF3)", border: "1px solid var(--Colors-Primary_Colors-Success-200, #A6F4C5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 0.75L3.25 6.25L0.75 3.75" stroke="#12B76A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* AI Interview Secret Prompt */}
                        {aiInterviewSecretPrompt && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 6.66667L16.0417 4.375L18.3333 3.33333L16.0417 2.29167L15 0L13.9583 2.29167L11.6667 3.33333L13.9583 4.375L15 6.66667Z" fill="url(#paint0_linear_3485_11351)"/>
                                            <path d="M15 11.6667L13.9583 13.9583L11.6667 15L13.9583 16.0417L15 18.3333L16.0417 16.0417L18.3333 15L16.0417 13.9583L15 11.6667Z" fill="url(#paint1_linear_3485_11351)"/>
                                            <path d="M8.75 7.08333L6.66667 2.5L4.58333 7.08333L0 9.16667L4.58333 11.25L6.66667 15.8333L8.75 11.25L13.3333 9.16667L8.75 7.08333ZM7.49167 9.99167L6.66667 11.8083L5.84167 9.99167L4.025 9.16667L5.84167 8.34167L6.66667 6.525L7.49167 8.34167L9.30833 9.16667L7.49167 9.99167Z" fill="url(#paint2_linear_3485_11351)"/>
                                            <defs>
                                                <linearGradient id="paint0_linear_3485_11351" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_3485_11351" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint2_linear_3485_11351" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>AI Interview Secret Prompt</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: "20px", fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                        {formatSecretPrompt(aiInterviewSecretPrompt).map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Interview Questions */}
                        {getTotalQuestions() > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Interview Questions</div>
                                    <div style={{ boxSizing: "border-box", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "2px 8px", width: "22px", height: "22px", background: "var(--Colors-Secondary_Colors-Blue-gray-50, #F8F9FC)", border: "1px solid var(--Colors-Secondary_Colors-Blue-gray-200, #D5D9EB)", borderRadius: "16px", fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "12px", lineHeight: "18px", letterSpacing: "0%", textAlign: "center", color: "var(--Colors-Secondary_Colors-Blue-gray-700, #363F72)" }}>
                                        {getTotalQuestions()}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {(() => {
                                        let globalQuestionNumber = 1;
                                        return categories.map((category) => {
                                            const questions = interviewQuestions[category] || [];
                                            if (questions.length === 0) return null;

                                            const categoryQuestions = questions.map((question) => {
                                                const currentNumber = globalQuestionNumber++;
                                                return { ...question, displayNumber: currentNumber };
                                            });

                                            return (
                                                <div key={category} style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                                    <strong>{category}:</strong>
                                                    <ol style={{ margin: 0, paddingLeft: "40px", display: "flex", flexDirection: "column", gap: "var(--spacing-xs, 8px)" }}>
                                                        {categoryQuestions.map((question) => (
                                                            <li key={question.id} style={{ marginBottom: 0 }}>
                                                                {question.text || `Question ${question.displayNumber}`}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            );
                                        });
                                    })()}
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

