"use client"

import styles from "@/lib/styles/components/career/careerPipelineStages.module.scss";

export default function CareerContentPipelineStages() {
    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.textContainer}>
                    <div className={styles.titleContainer}>
                        Customize pipeline stages
                    </div>
                    <div className={styles.supportingTextContainer}>
                        Create, modify, reorder, and delete stages and sub-stages. Core stages are fixed and can't be moved or edited as they are essential to Jia's system logic.
                    </div>
                </div>
                <div className={styles.actions}>
                    <button className={styles.restoreButton}>
                        <div className={styles.iconContainer}>
                            <img src="/iconsV3/restore.svg" alt="Restore" style={{ width: 18, height: 15 }} />
                        </div>
                        <span className={styles.buttonText}>Restore to default</span>
                    </button>
                    <button className={styles.restoreButton}>
                        <span className={styles.buttonText}>Copy pipeline from existing job</span>
                        <div className={styles.iconContainer}>
                            <img src="/iconsV3/chevronV3.svg" alt="Chevron" style={{ width: 12, height: 7 }} />
                        </div>
                    </button>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.leftContainer}>
                    <button className={styles.coreStageButton}>
                        <div className={styles.buttonIconContainer}>
                            <img src="/iconsV3/lock.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                        </div>
                        <span className={styles.coreStageText}>Core stage, cannot move</span>
                    </button>
                    <div className={styles.stageContentContainer}>
                        <div className={styles.stageHeader}>
                            <div className={styles.titleContainer}>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/human.svg" alt="Human" style={{ width: 12, height: 14 }} />
                                </div>
                                <span className={styles.stageTitle}>CV Screening</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/help.svg" alt="Help" style={{ width: 18, height: 18 }} />
                                </div>
                            </div>
                            <div className={styles.buttonIconContainer}>
                                <img src="/iconsV3/lockLight.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                            </div>
                        </div>
                        <div className={styles.substagesContainer}>
                            <div className={styles.substagesLabel}>Substages</div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Waiting Submission</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>For Review</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.leftContainer}>
                    <button className={styles.coreStageButton}>
                        <div className={styles.buttonIconContainer}>
                            <img src="/iconsV3/lock.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                        </div>
                        <span className={styles.coreStageText}>Core stage, cannot move</span>
                    </button>
                    <div className={styles.stageContentContainer}>
                        <div className={styles.stageHeader}>
                            <div className={styles.titleContainer}>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/human.svg" alt="Human" style={{ width: 12, height: 14 }} />
                                </div>
                                <span className={styles.stageTitle}>AI Interview</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/help.svg" alt="Help" style={{ width: 18, height: 18 }} />
                                </div>
                            </div>
                            <div className={styles.buttonIconContainer}>
                                <img src="/iconsV3/lockLight.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                            </div>
                        </div>
                        <div className={styles.substagesContainer}>
                            <div className={styles.substagesLabel}>Substages</div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Waiting Interview</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>For Review</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.iconContainer}>
                        <img src="/iconsV3/plusV3.svg" alt="Plus" style={{ width: 14, height: 14 }} />
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <button className={styles.coreStageButton}>
                        <div className={styles.buttonIconContainer}>
                            <img src="/iconsV3/lock.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                        </div>
                        <span className={styles.coreStageText}>Core stage, cannot move</span>
                    </button>
                    <div className={styles.stageContentContainer}>
                        <div className={styles.stageHeader}>
                            <div className={styles.titleContainer}>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/human.svg" alt="Human" style={{ width: 12, height: 14 }} />
                                </div>
                                <span className={styles.stageTitle}>Final Human Interview</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/help.svg" alt="Help" style={{ width: 18, height: 18 }} />
                                </div>
                            </div>
                            <div className={styles.buttonIconContainer}>
                                <img src="/iconsV3/lockLight.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                            </div>
                        </div>
                        <div className={styles.substagesContainer}>
                            <div className={styles.substagesLabel}>Substages</div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Waiting Schedule</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Waiting Interview</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>For Review</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <button className={styles.coreStageButton}>
                        <div className={styles.buttonIconContainer}>
                            <img src="/iconsV3/lock.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                        </div>
                        <span className={styles.coreStageText}>Core stage, cannot move</span>
                    </button>
                    <div className={styles.stageContentContainer}>
                        <div className={styles.stageHeader}>
                            <div className={styles.titleContainer}>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/human.svg" alt="Human" style={{ width: 12, height: 14 }} />
                                </div>
                                <span className={styles.stageTitle}>Job Offer</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/help.svg" alt="Help" style={{ width: 18, height: 18 }} />
                                </div>
                            </div>
                            <div className={styles.buttonIconContainer}>
                                <img src="/iconsV3/lockLight.svg" alt="Lock" style={{ width: 14, height: 18 }} />
                            </div>
                        </div>
                        <div className={styles.substagesContainer}>
                            <div className={styles.substagesLabel}>Substages</div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>For Final Review</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Waiting Offer Acceptance</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>For Contract Signing</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                            <div className={styles.substageCard}>
                                <span className={styles.substageText}>Hired</span>
                                <div className={styles.buttonIconContainer}>
                                    <img src="/iconsV3/lightningV2.svg" alt="Lightning" style={{ width: 14, height: 15 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

