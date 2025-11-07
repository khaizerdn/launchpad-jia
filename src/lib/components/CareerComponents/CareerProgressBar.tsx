"use client"

import styles from "@/lib/styles/components/careerProgressBar.module.scss";

interface CareerProgressBarProps {
    isStep1Complete?: boolean;
    currentStep?: number;
}

export default function CareerProgressBar({ isStep1Complete = false, currentStep = 1 }: CareerProgressBarProps) {
    return (
        <div className={styles.progressBar}>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 1 ? "#181D27" : "#181D27"}/>
                        </svg>
                    </div>
                    <div className={styles.dividerContainer}>
                        <div className={`${styles.divider} ${styles.dividerLeft} ${isStep1Complete ? styles.dividerActive : ''}`}></div>
                        <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 1 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>Career Details & Team Access</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 2 ? "#181D27" : "#D5D7DA"}/>
                        </svg>
                    </div>
                    <div className={styles.dividerContainer}>
                        <div className={`${styles.divider} ${styles.dividerLeft}`}></div>
                        <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 2 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>CV Review & Pre-screening</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 3 ? "#181D27" : "#D5D7DA"}/>
                        </svg>
                    </div>
                    <div className={styles.dividerContainer}>
                        <div className={`${styles.divider} ${styles.dividerLeft}`}></div>
                        <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 3 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>AI Interview Setup</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 4 ? "#181D27" : "#D5D7DA"}/>
                        </svg>
                    </div>
                    <div className={styles.dividerContainer}>
                        <div className={`${styles.divider} ${styles.dividerLeft}`}></div>
                        <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 4 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>Pipeline Stages</span>
                </div>
            </div>
            <div className={`${styles.stepProgress} ${styles.stepProgressLast}`} style={{ cursor: 'default' }}>
                <div className={`${styles.stepContainer} ${styles.stepContainerLast}`}>
                    <div className={styles.stepDot}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 5 ? "#181D27" : "#D5D7DA"}/>
                        </svg>
                    </div>
                </div>
                <div className={`${styles.textGroup} ${styles.textGroupLast}`}>
                    <span className={currentStep === 5 ? `${styles.stepTitle} ${styles.stepTitleLast}` : `${styles.stepTitle} ${styles.stepTitleLast} ${styles.inactive}`}>Review Career</span>
                </div>
            </div>
        </div>
    );
}

