"use client"

import { useState } from "react";
import styles from "@/lib/styles/components/careerForm.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";

interface CareerContentReviewPipelineProps {
    pipelineStages?: any[];
}

export default function CareerContentReviewPipeline({
    pipelineStages = [],
}: CareerContentReviewPipelineProps) {
    const [isExpanded, setIsExpanded] = useState(true);

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
                        <span className={cardStyles.careerCardTitle}>Pipeline Stages</span>
                    </div>
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--Button-bg-secondary, #ffffff)", border: "1px solid var(--Button-border-primary, #d5d7da)", borderRadius: "50%", cursor: "pointer" }}>
                        <img alt="" src={assetConstants.edit} />
                    </div>
                </div>
                {isExpanded && (
                <div className={cardStyles.careerCardContent} style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md, 16px)" }}>
                        {pipelineStages && pipelineStages.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {pipelineStages.map((stage, index) => (
                                    <div key={index} style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", color: "var(--Text-text-secondary, #414651)" }}>
                                        {index + 1}. {stage.name || stage}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontFamily: "inherit", fontWeight: 500, fontStyle: "normal", fontSize: "16px", lineHeight: "24px", letterSpacing: "0%", color: "var(--Text-text-secondary, #414651)" }}>
                                No pipeline stages configured.
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

