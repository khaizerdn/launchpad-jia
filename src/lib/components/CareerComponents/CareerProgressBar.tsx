"use client"

import styles from "@/lib/styles/components/careerProgressBar.module.scss";

interface CareerProgressBarProps {
    isStep1Complete?: boolean;
    isStep1Ready?: boolean;
    currentStep?: number;
    hasStep1Errors?: boolean;
}

export default function CareerProgressBar({ isStep1Complete = false, isStep1Ready = false, currentStep = 1, hasStep1Errors = false }: CareerProgressBarProps) {
    return (
        <div className={styles.progressBar}>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        {hasStep1Errors ? (
                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.54164 5.92062V9.25395M9.54164 12.5873H9.54998M8.11664 1.63729L1.05831 13.4206C0.912783 13.6726 0.835782 13.9584 0.834967 14.2494C0.834153 14.5404 0.909552 14.8266 1.05367 15.0794C1.19778 15.3322 1.40558 15.5429 1.6564 15.6905C1.90722 15.8381 2.19231 15.9174 2.48331 15.9206H16.6C16.891 15.9174 17.1761 15.8381 17.4269 15.6905C17.6777 15.5429 17.8855 15.3322 18.0296 15.0794C18.1737 14.8266 18.2491 14.5404 18.2483 14.2494C18.2475 13.9584 18.1705 13.6726 18.025 13.4206L10.9666 1.63729C10.8181 1.39237 10.6089 1.18989 10.3593 1.04936C10.1097 0.908826 9.82809 0.834999 9.54164 0.834999C9.2552 0.834999 8.97359 0.908826 8.72398 1.04936C8.47438 1.18989 8.2652 1.39237 8.11664 1.63729Z" stroke="#F04438" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : isStep1Complete ? (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.66667 12.5L2.5 8.33333L3.675 7.15833L6.66667 10.1417L12.9917 3.81667L14.1667 5L6.66667 12.5Z" fill="#181D27"/>
                            </svg>
                        ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 1 ? "#181D27" : "#181D27"}/>
                            </svg>
                        )}
                    </div>
                    <div className={styles.dividerContainer}>
                        {currentStep > 1 ? (
                            <div className={styles.dividerFull}></div>
                        ) : (
                            <>
                                <div className={`${styles.divider} ${styles.dividerLeft} ${isStep1Ready ? styles.dividerActive : ''}`}></div>
                                <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 1 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>Career Details & Team Access</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        {currentStep > 2 ? (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.66667 12.5L2.5 8.33333L3.675 7.15833L6.66667 10.1417L12.9917 3.81667L14.1667 5L6.66667 12.5Z" fill="#181D27"/>
                            </svg>
                        ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 2 ? "#181D27" : "#D5D7DA"}/>
                            </svg>
                        )}
                    </div>
                    <div className={styles.dividerContainer}>
                        {currentStep > 2 ? (
                            <div className={styles.dividerFull}></div>
                        ) : (
                            <>
                                <div className={`${styles.divider} ${styles.dividerLeft} ${currentStep > 1 ? styles.dividerActive : ''}`}></div>
                                <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 2 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>CV Review & Pre-screening</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        {currentStep > 3 ? (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.66667 12.5L2.5 8.33333L3.675 7.15833L6.66667 10.1417L12.9917 3.81667L14.1667 5L6.66667 12.5Z" fill="#181D27"/>
                            </svg>
                        ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 3 ? "#181D27" : "#D5D7DA"}/>
                            </svg>
                        )}
                    </div>
                    <div className={styles.dividerContainer}>
                        {currentStep > 3 ? (
                            <div className={styles.dividerFull}></div>
                        ) : (
                            <>
                                <div className={`${styles.divider} ${styles.dividerLeft} ${currentStep > 2 ? styles.dividerActive : ''}`}></div>
                                <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 3 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>AI Interview Setup</span>
                </div>
            </div>
            <div className={styles.stepProgress} style={{ cursor: 'default' }}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepDot}>
                        {currentStep > 4 ? (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.66667 12.5L2.5 8.33333L3.675 7.15833L6.66667 10.1417L12.9917 3.81667L14.1667 5L6.66667 12.5Z" fill="#181D27"/>
                            </svg>
                        ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 4 ? "#181D27" : "#D5D7DA"}/>
                            </svg>
                        )}
                    </div>
                    <div className={styles.dividerContainer}>
                        {currentStep > 4 ? (
                            <div className={styles.dividerFull}></div>
                        ) : (
                            <>
                                <div className={`${styles.divider} ${styles.dividerLeft} ${currentStep > 3 ? styles.dividerActive : ''}`}></div>
                                <div className={`${styles.divider} ${styles.dividerRight}`}></div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.textGroup}>
                    <span className={currentStep === 4 ? styles.stepTitle : `${styles.stepTitle} ${styles.inactive}`}>Pipeline Stages</span>
                </div>
            </div>
            <div className={`${styles.stepProgress} ${styles.stepProgressLast}`} style={{ cursor: 'default' }}>
                <div className={`${styles.stepContainer} ${styles.stepContainerLast}`}>
                    <div className={styles.stepDot}>
                        {currentStep > 5 ? (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.66667 12.5L2.5 8.33333L3.675 7.15833L6.66667 10.1417L12.9917 3.81667L14.1667 5L6.66667 12.5Z" fill="#181D27"/>
                            </svg>
                        ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z" fill={currentStep === 5 ? "#181D27" : "#D5D7DA"}/>
                            </svg>
                        )}
                    </div>
                </div>
                <div className={`${styles.textGroup} ${styles.textGroupLast}`}>
                    <span className={currentStep === 5 ? `${styles.stepTitle} ${styles.stepTitleLast}` : `${styles.stepTitle} ${styles.stepTitleLast} ${styles.inactive}`}>Review Career</span>
                </div>
            </div>
        </div>
    );
}

