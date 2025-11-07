"use client"

import { useState, useRef, useEffect } from "react";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";

interface CareerContentScreeningProps {
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    screeningSettingList: any[];
}

export default function CareerContentScreening({
    screeningSetting,
    setScreeningSetting,
    screeningSettingList,
}: CareerContentScreeningProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    // Close tooltip when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                tooltipRef.current &&
                iconRef.current &&
                !tooltipRef.current.contains(event.target as Node) &&
                !iconRef.current.contains(event.target as Node)
            ) {
                setShowTooltip(false);
            }
        }

        if (showTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTooltip]);

    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>1. CV Review Settings</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <span className={cardStyles.sectionTitle}>CV Screening</span>
                                <p className={cardStyles.sectionDescription}>
                                    Jia automatically endorses candidates who meet the chosen criteria.
                                </p>
                            </div>
                            <div className={cardStyles.fieldContainer}>
                                <CustomDropdown
                                    onSelectSetting={(setting) => {
                                        setScreeningSetting(setting);
                                    }}
                                    screeningSetting={screeningSetting}
                                    settingList={screeningSettingList}
                                    placeholder="Select screening setting"
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", position: "relative" }}>
                                    <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 6.66667L16.0417 4.375L18.3333 3.33333L16.0417 2.29167L15 0L13.9583 2.29167L11.6667 3.33333L13.9583 4.375L15 6.66667Z" fill="url(#paint0_linear_1238_10151)"/>
                                            <path d="M15 11.6667L13.9583 13.9583L11.6667 15L13.9583 16.0417L15 18.3333L16.0417 16.0417L18.3333 15L16.0417 13.9583L15 11.6667Z" fill="url(#paint1_linear_1238_10151)"/>
                                            <path d="M8.75 7.08333L6.66667 2.5L4.58333 7.08333L0 9.16667L4.58333 11.25L6.66667 15.8333L8.75 11.25L13.3333 9.16667L8.75 7.08333ZM7.49167 9.99167L6.66667 11.8083L5.84167 9.99167L4.025 9.16667L5.84167 8.34167L6.66667 6.525L7.49167 8.34167L9.30833 9.16667L7.49167 9.99167Z" fill="url(#paint2_linear_1238_10151)"/>
                                            <defs>
                                                <linearGradient id="paint0_linear_1238_10151" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_1238_10151" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint2_linear_1238_10151" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span className={cardStyles.sectionTitle}>
                                        CV Secret Prompt <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
                                    </span>
                                    <div 
                                        ref={iconRef}
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                                        onClick={() => setShowTooltip(!showTooltip)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_1238_2290)">
                                                <path d="M6.05998 6.00001C6.21672 5.55446 6.52608 5.17875 6.93328 4.93943C7.34048 4.70012 7.81924 4.61264 8.28476 4.69248C8.75028 4.77233 9.17252 5.01436 9.4767 5.3757C9.78087 5.73703 9.94735 6.19436 9.94665 6.66668C9.94665 8.00001 7.94665 8.66668 7.94665 8.66668M7.99998 11.3333H8.00665M14.6666 8.00001C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8.00001C1.33331 4.31811 4.31808 1.33334 7.99998 1.33334C11.6819 1.33334 14.6666 4.31811 14.6666 8.00001Z" stroke="#717680" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1238_2290">
                                                    <rect width="16" height="16" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        {showTooltip && (
                                            <div 
                                                ref={tooltipRef}
                                                style={{
                                                    position: "absolute",
                                                    bottom: "20px",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: "433px",
                                                    height: "58px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    padding: "0px",
                                                    boxShadow: "0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03)",
                                                    borderRadius: "8px",
                                                    zIndex: 1000,
                                                    background: "transparent"
                                                }}
                                            >
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    padding: "8px 12px",
                                                    width: "433px",
                                                    height: "52px",
                                                    background: "#181D27",
                                                    borderRadius: "8px",
                                                    flex: "none",
                                                    order: 0,
                                                    alignSelf: "stretch",
                                                    flexGrow: 0
                                                }}>
                                                    <div style={{
                                                        width: "409px",
                                                        height: "36px",
                                                        fontFamily: "'Satoshi'",
                                                        fontStyle: "normal",
                                                        fontWeight: 700,
                                                        fontSize: "12px",
                                                        lineHeight: "18px",
                                                        textAlign: "center",
                                                        color: "#FFFFFF",
                                                        flex: "none",
                                                        order: 0,
                                                        flexGrow: 0
                                                    }}>
                                                        These prompts remain hidden from candidates and the public job portal. Additionally, only Admins and the Job Owner can view the secret prompt.
                                                    </div>
                                                </div>
                                                <div style={{
                                                    position: "absolute",
                                                    width: "12px",
                                                    height: "12px",
                                                    left: "calc(50% - 12px/2 - 2.49px)",
                                                    bottom: "5px",
                                                    background: "#181D27",
                                                    borderRadius: "1px",
                                                    transform: "rotate(45deg)",
                                                    flex: "none",
                                                    order: 1,
                                                    flexGrow: 0
                                                }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className={cardStyles.sectionDescription}>
                                    Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>
                            2. Pre-Screening Questions <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span> 0
                        </span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        {/* Content will be added here */}
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                <div className="layered-card-middle">
                    <div className={cardStyles.careerCardHeader}>
                        <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58333 16.6667H7.91667C7.91667 17.5833 7.16667 18.3333 6.25 18.3333C5.33333 18.3333 4.58333 17.5833 4.58333 16.6667ZM2.91667 15.8333H9.58333V14.1667H2.91667V15.8333ZM12.5 7.91667C12.5 11.1 10.2833 12.8 9.35833 13.3333H3.14167C2.21667 12.8 0 11.1 0 7.91667C0 4.46667 2.8 1.66667 6.25 1.66667C9.7 1.66667 12.5 4.46667 12.5 7.91667ZM10.8333 7.91667C10.8333 5.39167 8.775 3.33333 6.25 3.33333C3.725 3.33333 1.66667 5.39167 1.66667 7.91667C1.66667 9.975 2.90833 11.1583 3.625 11.6667H8.875C9.59167 11.1583 10.8333 9.975 10.8333 7.91667ZM16.5583 6.14167L15.4167 6.66667L16.5583 7.19167L17.0833 8.33333L17.6083 7.19167L18.75 6.66667L17.6083 6.14167L17.0833 5L16.5583 6.14167ZM14.5833 5L15.3667 3.28333L17.0833 2.5L15.3667 1.71667L14.5833 0L13.8 1.71667L12.0833 2.5L13.8 3.28333L14.5833 5Z" fill="url(#paint0_linear_1238_3980)"/>
                                <defs>
                                    <linearGradient id="paint0_linear_1238_3980" x1="-0.000291994" y1="18.3332" x2="18.3285" y2="-0.412159" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FCCEC0"/>
                                        <stop offset="0.33" stopColor="#EBACC9"/>
                                        <stop offset="0.66" stopColor="#CEB6DA"/>
                                        <stop offset="1" stopColor="#9FCAED"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className={cardStyles.careerCardTitle}>Tips</span>
                    </div>
                    <div className={tipsStyles.tipsContent}>
                        <div className={tipsStyles.tipsText}>
                            <span className={tipsStyles.tipsTextBold}>Add a Secret Prompt</span> to fine-tune how Jia scores and evaluates submitted CVs.
                            <br /><br />
                            <span className={tipsStyles.tipsTextBold}>Add Pre-Screening questions</span> to collect key details such as notice period, work setup, or salary expectations to guide your review and candidate discussions.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

