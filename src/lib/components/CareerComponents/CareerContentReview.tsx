"use client"

import { useState } from "react";
import styles from "@/lib/styles/components/careerForm.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";

interface CareerContentReviewProps {
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
}

export default function CareerContentReview({
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
}: CareerContentReviewProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const formatSalary = (salary: string, isNegotiable: boolean) => {
        if (isNegotiable) return "Negotiable";
        if (!salary || salary === "0") return "Negotiable";
        return `₱${Number(salary).toLocaleString()}`;
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
                        <span className={cardStyles.careerCardTitle}>Career Details & Team Access</span>
                    </div>
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--Button-bg-secondary, #ffffff)", border: "1px solid var(--Button-border-primary, #d5d7da)", borderRadius: "50%", cursor: "pointer" }}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpanded && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                        {/* Job Title */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                            <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Job Title</div>
                            <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{jobTitle || "—"}</div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* Employment Type & Work Arrangement */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Employment Type</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{employmentType || "—"}</div>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Work Arrangement</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{workSetup || "—"}</div>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* Location */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Country</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{country || "—"}</div>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>State / Province</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{province || "—"}</div>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>City</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{city || "—"}</div>
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* Salary Range */}
                        <div style={{ display: "flex", gap: "24px" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Minimum Salary</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{formatSalary(minimumSalary, salaryNegotiable)}</div>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Maximum Salary</div>
                                <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{formatSalary(maximumSalary, salaryNegotiable)}</div>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {/* Job Description */}
                        {description && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Job Description</div>
                                    <div 
                                        style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Responsibilities */}
                        {responsibilities.length > 0 && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Responsibilities:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px", fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                        {responsibilities.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Qualifications */}
                        {qualifications.length > 0 && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Qualifications:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px", fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                        {qualifications.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Nice to have */}
                        {niceToHave.length > 0 && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xss, 4px)" }}>
                                    <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Nice to have:</div>
                                    <ul style={{ margin: 0, paddingLeft: "20px", fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>
                                        {niceToHave.map((item, index) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                            </>
                        )}

                        {/* Team Access */}
                        {teamMembers.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                                <div style={{ fontFamily: "inherit", fontWeight: 700, fontStyle: "normal", fontSize: "14px", lineHeight: "20px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-primary, #181D27)" }}>Team Access</div>
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
                                        <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", verticalAlign: "middle", color: "var(--Text-text-secondary, #414651)" }}>{member.role || "—"}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

