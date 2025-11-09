"use client"

import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";

export default function CareerContentPipelineStages() {
    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>Pipeline Stages</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        {/* Content will be added here */}
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                <div className="layered-card-middle">
                    <div className={cardStyles.careerCardHeader}>
                        <img alt="" src="/iconsV3/bulb.svg" />
                        <span className={cardStyles.careerCardTitle}>Tips</span>
                    </div>
                    <div className={tipsStyles.tipsContent}>
                        <div className={tipsStyles.tipsText}>
                            <span className={tipsStyles.tipsTextBold}>Use clear, standard job titles</span> for better searchability (e.g., "Software Engineer" instead of "Code Ninja" or "Tech Rockstar").
                            <br /><br />
                            <span className={tipsStyles.tipsTextBold}>Avoid abbreviations</span> or internal role codes that applicants may not understand (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").
                            <br /><br />
                            <span className={tipsStyles.tipsTextBold}>Keep it concise</span> – job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

