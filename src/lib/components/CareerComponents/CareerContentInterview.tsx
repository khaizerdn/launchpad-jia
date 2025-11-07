"use client"

import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";

interface CareerContentInterviewProps {
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    screeningSettingList: any[];
    requireVideo: boolean;
    setRequireVideo: (value: boolean) => void;
}

export default function CareerContentInterview({
    screeningSetting,
    setScreeningSetting,
    screeningSettingList,
    requireVideo,
    setRequireVideo,
}: CareerContentInterviewProps) {
    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>1. AI Interview Settings</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <span className={cardStyles.sectionTitle}>AI Interview Screening</span>
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
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB", margin: "24px 0" }}></div>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <span className={cardStyles.sectionTitle}>Require Video on Interview</span>
                                <p className={cardStyles.sectionDescription}>
                                    Require candidates to keep their camera on. Recordings will appear on their analysis page.
                                </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, width: "100%" }}>
                                <div style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                                    <i className="la la-video" style={{ color: "#414651", fontSize: 20 }}></i>
                                    <span>Require Video Interview</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <label className="switch">
                                        <input type="checkbox" checked={requireVideo} onChange={() => setRequireVideo(!requireVideo)} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span>{requireVideo ? "Yes" : "No"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>2. AI Interview Questions 0</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        {/* Content will be added here */}
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                <div className="layered-card-middle">
                    <div className={cardStyles.careerCardHeader}>
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
                        <span className={cardStyles.careerCardTitle}>Tips</span>
                    </div>
                    <div className={tipsStyles.tipsContent}>
                        <div className={tipsStyles.tipsText}>
                            <span className={tipsStyles.tipsTextBold}>Add a Secret Prompt</span> to fine-tune how Jia scores and evaluates the interview responses.
                            <br /><br />
                            <span className={tipsStyles.tipsTextBold}>Use "Generate Questions"</span> to quickly create tailored interview questions, then refine or mix them with your own for balanced results.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

