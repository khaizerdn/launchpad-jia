"use client"

import { useState } from "react";
import styles from "@/lib/styles/components/career/careerForm.module.scss";
import cardStyles from "@/lib/styles/components/career/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";
import LayeredCard from "@/lib/components/LayeredCard";
import { stripHTMLTags, sanitizeHTML } from "@/lib/utils/validation";

interface CareerContentReviewCareerProps {
    jobTitle?: string;
    employmentType?: string;
    workSetup?: string;
    country?: string;
    province?: string;
    city?: string;
    minimumSalary?: string;
    maximumSalary?: string;
    salaryNegotiable?: boolean;
    description?: string;
    responsibilities?: string[];
    qualifications?: string[];
    niceToHave?: string[];
    teamMembers?: any[];
    screeningSetting?: string;
    cvSecretPrompt?: string;
    preScreeningQuestions?: any[];
    preScreeningQuestionOptions?: {[questionId: string]: {id: string, value: string, number: number}[]};
    preScreeningQuestionSalaryRanges?: {[questionId: string]: {minimum: string, maximum: string}};
    requireVideo?: boolean;
    aiInterviewSecretPrompt?: string;
    interviewQuestions?: {[category: string]: {id: string, text: string, isEditing: boolean}[]};
    pipelineStages?: any[];
}

export default function CareerContentReviewCareer({
    jobTitle = "",
    employmentType = "",
    workSetup = "",
    country = "",
    province = "",
    city = "",
    minimumSalary = "",
    maximumSalary = "",
    salaryNegotiable = false,
    description = "",
    responsibilities = [],
    qualifications = [],
    niceToHave = [],
    teamMembers = [],
    screeningSetting = "",
    cvSecretPrompt = "",
    preScreeningQuestions = [],
    preScreeningQuestionOptions = {},
    preScreeningQuestionSalaryRanges = {},
    requireVideo = false,
    aiInterviewSecretPrompt = "",
    interviewQuestions = {},
    pipelineStages = [],
}: CareerContentReviewCareerProps) {
    const [isExpandedCareer, setIsExpandedCareer] = useState(true);
    const [isExpandedScreening, setIsExpandedScreening] = useState(true);
    const [isExpandedInterview, setIsExpandedInterview] = useState(true);
    const [isExpandedPipeline, setIsExpandedPipeline] = useState(true);

    const formatSalary = (salary: string, isNegotiable: boolean) => {
        if (isNegotiable) return "Negotiable";
        if (!salary || salary === "0") return "Negotiable";
        return `₱${Number(salary).toLocaleString()}`;
    };

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

    const getTotalQuestions = () => {
        return Object.values(interviewQuestions).reduce((total, questions) => total + (questions?.length || 0), 0);
    };

    const categories = ['CV Validation / Experience', 'Technical', 'Behavioral', 'Analytical', 'Others'];

    return (
        <div className={styles.reviewMainContainer}>
            {/* Career Details & Team Access */}
            <LayeredCard>
                <div className={cardStyles.careerCardHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div 
                            className={cardStyles.reviewChevronContainer}
                            onClick={() => setIsExpandedCareer(!isExpandedCareer)}
                        >
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isExpandedCareer ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                                <path d="M0.833984 0.833328L5.83398 5.83333L10.834 0.833328" stroke="#717680" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>Career Details & Team Access</span>
                    </div>
                    <div className={cardStyles.reviewEditIconContainer}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpandedCareer && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div className={cardStyles.reviewContentContainer}>
                        {/* Job Title */}
                        <div className={cardStyles.reviewSectionContainer}>
                            <div className={cardStyles.sectionTitle}>Job Title</div>
                            <div className={cardStyles.reviewData}>{jobTitle ? stripHTMLTags(jobTitle) : "—"}</div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* Employment Type & Work Arrangement */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>Employment Type</div>
                                <div className={cardStyles.reviewData}>{employmentType || "—"}</div>
                            </div>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>Work Arrangement</div>
                                <div className={cardStyles.reviewData}>{workSetup || "—"}</div>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* Location */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>Country</div>
                                <div className={cardStyles.reviewData}>{country || "—"}</div>
                            </div>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>State / Province</div>
                                <div className={cardStyles.reviewData}>{province || "—"}</div>
                            </div>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>City</div>
                                <div className={cardStyles.reviewData}>{city || "—"}</div>
                            </div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* Salary Range */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>Minimum Salary</div>
                                <div className={cardStyles.reviewData}>{formatSalary(minimumSalary, salaryNegotiable)}</div>
                            </div>
                            <div style={{ flex: 1 }} className={cardStyles.reviewSectionContainer}>
                                <div className={cardStyles.sectionTitle}>Maximum Salary</div>
                                <div className={cardStyles.reviewData}>{formatSalary(maximumSalary, salaryNegotiable)}</div>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* Job Description */}
                        {description && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div className={cardStyles.sectionTitle}>Job Description</div>
                                    <div 
                                        className={cardStyles.reviewData}
                                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                                    />
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Responsibilities */}
                        {responsibilities.length > 0 && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div className={cardStyles.sectionTitle}>Responsibilities:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px" }} className={cardStyles.reviewData}>
                                        {responsibilities.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Qualifications */}
                        {qualifications.length > 0 && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div className={cardStyles.sectionTitle}>Qualifications:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px" }} className={cardStyles.reviewData}>
                                        {qualifications.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Nice to have */}
                        {niceToHave.length > 0 && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div className={cardStyles.sectionTitle}>Nice to have:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px" }} className={cardStyles.reviewData}>
                                        {niceToHave.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Team Access */}
                        {teamMembers.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                                <div className={cardStyles.sectionTitle}>Team Access</div>
                                {teamMembers.map((member, index) => (
                                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#E9EAEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {member.avatar ? (
                                                    <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ fontSize: "16px", fontWeight: 600, color: "#717680" }}>
                                                        {member.name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", color: "var(--Text-text-secondary, #414651)" }}>
                                                    {member.name}{member.isCurrentUser ? <span style={{ color: "var(--Text-text-tertiary, #717680)" }}> (You)</span> : ""}
                                                </div>
                                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", color: "var(--Text-text-tertiary, #717680)" }}>{member.email || "—"}</div>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}></div>
                                        <div className={cardStyles.reviewData}>{member.role || "—"}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )}
            </LayeredCard>

            {/* CV Review & Pre-screening */}
            <LayeredCard>
                <div className={cardStyles.careerCardHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div 
                            className={cardStyles.reviewChevronContainer}
                            onClick={() => setIsExpandedScreening(!isExpandedScreening)}
                        >
                            <svg 
                                width="12" 
                                height="7" 
                                viewBox="0 0 12 7" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: isExpandedScreening ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                            >
                                <path d="M0.833984 0.833328L5.83398 5.83333L10.834 0.833328" stroke="#717680" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>CV Review & Pre-screening</span>
                    </div>
                    <div className={cardStyles.reviewEditIconContainer}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpandedScreening && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div className={cardStyles.reviewContentContainer}>
                        {/* CV Screening */}
                        <div className={cardStyles.reviewSectionContainer}>
                            <div className={cardStyles.sectionTitle}>CV Screening</div>
                            <div className={cardStyles.reviewData}>
                                Automatically endorse candidates who are {(() => {
                                    if (!screeningSetting) return "—";
                                    // Extract first part (e.g., "Good Fit") and the rest (e.g., "and above")
                                    const parts = screeningSetting.split(" and ");
                                    const firstPart = parts[0] || screeningSetting;
                                    const rest = parts.length > 1 ? " and " + parts.slice(1).join(" and ") : "";
                                    return (
                                        <>
                                            <span className={cardStyles.reviewBadge}>{firstPart}</span>
                                            {rest}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* CV Secret Prompt */}
                        {cvSecretPrompt && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <img alt="" src="/iconsV3/sparkle.svg" />
                                        <div className={cardStyles.sectionTitle}>CV Secret Prompt</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: "20px" }} className={cardStyles.reviewData}>
                                        {formatSecretPrompt(cvSecretPrompt).map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Pre-Screening Questions */}
                        {preScreeningQuestions.length > 0 && (
                            <div className={cardStyles.reviewSectionContainer}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div className={cardStyles.sectionTitle}>Pre-Screening Questions</div>
                                    <div className={cardStyles.reviewQuestionBadge}>
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
                                            <div key={question.id} className={cardStyles.reviewData}>
                                                {index + 1}. {question.description || question.title || `Question ${index + 1}`}
                                                {questionType === "Range" && salaryRange ? (
                                                    <ul className={cardStyles.reviewList}>
                                                        <li className={cardStyles.reviewListItem}>
                                                            Preferred: PHP {Number(salaryRange.minimum).toLocaleString()} - PHP {Number(salaryRange.maximum).toLocaleString()}
                                                        </li>
                                                    </ul>
                                                ) : options.length > 0 ? (
                                                    <ul className={cardStyles.reviewList}>
                                                        {options.map((option: any) => (
                                                            <li key={option.id} className={cardStyles.reviewListItem}>{option.value}</li>
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
            </LayeredCard>

            {/* AI Interview Setup */}
            <LayeredCard>
                <div className={cardStyles.careerCardHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div 
                            className={cardStyles.reviewChevronContainer}
                            onClick={() => setIsExpandedInterview(!isExpandedInterview)}
                        >
                            <svg 
                                width="12" 
                                height="7" 
                                viewBox="0 0 12 7" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: isExpandedInterview ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                            >
                                <path d="M0.833984 0.833328L5.83398 5.83333L10.834 0.833328" stroke="#717680" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>AI Interview Setup</span>
                    </div>
                    <div className={cardStyles.reviewEditIconContainer}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpandedInterview && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div className={cardStyles.reviewContentContainer}>
                        {/* AI Interview Screening */}
                        <div className={cardStyles.reviewSectionContainer}>
                            <div className={cardStyles.sectionTitle}>AI Interview Screening</div>
                            <div className={cardStyles.reviewData}>
                                Automatically endorse candidates who are {(() => {
                                    if (!screeningSetting) return "—";
                                    // Extract first part (e.g., "Good Fit") and the rest (e.g., "and above")
                                    const parts = screeningSetting.split(" and ");
                                    const firstPart = parts[0] || screeningSetting;
                                    const rest = parts.length > 1 ? " and " + parts.slice(1).join(" and ") : "";
                                    return (
                                        <>
                                            <span className={cardStyles.reviewBadge}>{firstPart}</span>
                                            {rest}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className={cardStyles.reviewDivider}></div>

                        {/* Require Video on Interview */}
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <div className={cardStyles.sectionTitle}>Require Video on Interview</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div className={cardStyles.reviewData}>
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
                        <div className={cardStyles.reviewDivider}></div>

                        {/* AI Interview Secret Prompt */}
                        {aiInterviewSecretPrompt && (
                            <>
                                <div className={cardStyles.reviewSectionContainer}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <img alt="" src="/iconsV3/sparkle.svg" />
                                        <div className={cardStyles.sectionTitle}>AI Interview Secret Prompt</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: "20px" }} className={cardStyles.reviewData}>
                                        {formatSecretPrompt(aiInterviewSecretPrompt).map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={cardStyles.reviewDivider}></div>
                            </>
                        )}

                        {/* Interview Questions */}
                        {getTotalQuestions() > 0 && (
                            <div className={cardStyles.reviewSectionContainer}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div className={cardStyles.sectionTitle}>Interview Questions</div>
                                    <div className={cardStyles.reviewQuestionBadge}>
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
                                                <div key={category} className={cardStyles.reviewData}>
                                                    <strong>{category}:</strong>
                                                    <ol className={cardStyles.reviewList}>
                                                        {categoryQuestions.map((question) => (
                                                            <li key={question.id} className={cardStyles.reviewListItem}>
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
            </LayeredCard>

            {/* Pipeline Stages */}
            <LayeredCard>
                <div className={cardStyles.careerCardHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div 
                            className={cardStyles.reviewChevronContainer}
                            onClick={() => setIsExpandedPipeline(!isExpandedPipeline)}
                        >
                            <svg 
                                width="12" 
                                height="7" 
                                viewBox="0 0 12 7" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: isExpandedPipeline ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                            >
                                <path d="M0.833984 0.833328L5.83398 5.83333L10.834 0.833328" stroke="#717680" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>Pipeline Stages</span>
                    </div>
                    <div className={cardStyles.reviewEditIconContainer}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpandedPipeline && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div className={cardStyles.reviewContentContainer}>
                        {pipelineStages && pipelineStages.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {pipelineStages.map((stage, index) => (
                                    <div key={index} className={cardStyles.reviewData}>
                                        {index + 1}. {stage.name || stage}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={cardStyles.reviewData}>
                                No pipeline stages configured.
                            </div>
                        )}
                    </div>
                </div>
                )}
            </LayeredCard>
        </div>
    );
}

