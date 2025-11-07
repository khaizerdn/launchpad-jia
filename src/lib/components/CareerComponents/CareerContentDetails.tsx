"use client"

import { useState, useEffect } from "react";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import MemberDropdown from "./MemberDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import errorStyles from "@/lib/styles/components/careerErrorField.module.scss";

const workSetupOptions = [
    {
        name: "Fully Remote",
    },
    {
        name: "Onsite",
    },
    {
        name: "Hybrid",
    },
];

const employmentTypeOptions = [
    {
        name: "Full-Time",
    },
    {
        name: "Part-Time",
    },
];

interface CareerContentDetailsProps {
    jobTitle: string;
    setJobTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    workSetup: string;
    setWorkSetup: (value: string) => void;
    employmentType: string;
    setEmploymentType: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    minimumSalary: string;
    setMinimumSalary: (value: string) => void;
    maximumSalary: string;
    setMaximumSalary: (value: string) => void;
    salaryNegotiable: boolean;
    setSalaryNegotiable: (value: boolean) => void;
    teamMembers: any[];
    setTeamMembers: (value: any[]) => void;
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    requireVideo: boolean;
    setRequireVideo: (value: boolean) => void;
    screeningSettingList: any[];
    fieldErrors: {[key: string]: string};
    setFieldErrors: (errors: {[key: string]: string}) => void;
}

export default function CareerContentDetails({
    jobTitle,
    setJobTitle,
    description,
    setDescription,
    workSetup,
    setWorkSetup,
    employmentType,
    setEmploymentType,
    country,
    setCountry,
    province,
    setProvince,
    city,
    setCity,
    minimumSalary,
    setMinimumSalary,
    maximumSalary,
    setMaximumSalary,
    salaryNegotiable,
    setSalaryNegotiable,
    teamMembers,
    setTeamMembers,
    screeningSetting,
    setScreeningSetting,
    requireVideo,
    setRequireVideo,
    screeningSettingList,
    fieldErrors,
    setFieldErrors,
}: CareerContentDetailsProps) {
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        const parseProvinces = () => {
            const sortedProvinces = [...philippineCitiesAndProvinces.provinces].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            setProvinceList(sortedProvinces);
            const defaultProvince = sortedProvinces[0];
            if (province) {
                const selectedProvince = sortedProvinces.find(p => p.name === province);
                if (selectedProvince) {
                    const cities = philippineCitiesAndProvinces.cities
                        .filter((city) => city.province === selectedProvince.key)
                        .sort((a, b) => a.name.localeCompare(b.name));
                    setCityList(cities);
                }
            } else {
                const cities = philippineCitiesAndProvinces.cities
                    .filter((city) => city.province === defaultProvince.key)
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCityList(cities);
            }
        }
        parseProvinces();
    }, [province]);

    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>1. Career Information</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div className={styles.basicInfoContainer}>
                            <span className={cardStyles.sectionTitle}>Basic Information</span>
                            <div className={styles.jobTitleField}>
                                <span>Job Title</span>
                                <input
                                    value={jobTitle}
                                    className="form-control"
                                    placeholder="Enter job title"
                                    style={{ border: fieldErrors.jobTitle ? "1px solid var(--Input-border-destructive, #FDA29B) !important" : undefined }}
                                    onChange={(e) => {
                                        setJobTitle(e.target.value || "");
                                        if (fieldErrors.jobTitle) {
                                            const newErrors = { ...fieldErrors };
                                            delete newErrors.jobTitle;
                                            setFieldErrors(newErrors);
                                        }
                                    }}
                                ></input>
                                {fieldErrors.jobTitle && (
                                    <span className={errorStyles.errorMessage}>
                                        {fieldErrors.jobTitle}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <span className={cardStyles.sectionTitle}>Work Setting</span>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={cardStyles.fieldContainer}>
                                    <span>Employment Type</span>
                                    <CustomDropdown
                                        onSelectSetting={(employmentType) => {
                                            setEmploymentType(employmentType);
                                            if (fieldErrors.employmentType) {
                                                const newErrors = { ...fieldErrors };
                                                delete newErrors.employmentType;
                                                setFieldErrors(newErrors);
                                            }
                                        }}
                                        screeningSetting={employmentType}
                                        settingList={employmentTypeOptions}
                                        placeholder="Choose employment type"
                                        error={fieldErrors.employmentType}
                                    />
                                    {fieldErrors.employmentType && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.employmentType}
                                        </span>
                                    )}
                                </div>
                                <div className={cardStyles.fieldContainer}>
                                    <span>Arrangement</span>
                                    <CustomDropdown
                                        onSelectSetting={(setting) => {
                                            setWorkSetup(setting);
                                            if (fieldErrors.workSetup) {
                                                const newErrors = { ...fieldErrors };
                                                delete newErrors.workSetup;
                                                setFieldErrors(newErrors);
                                            }
                                        }}
                                        screeningSetting={workSetup}
                                        settingList={workSetupOptions}
                                        placeholder="Choose work arrangement"
                                        error={fieldErrors.workSetup}
                                    />
                                    {fieldErrors.workSetup && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.workSetup}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <span className={cardStyles.sectionTitle}>Location</span>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={cardStyles.fieldContainer}>
                                    <span>Country</span>
                                    <CustomDropdown
                                        onSelectSetting={(setting) => {
                                            setCountry(setting);
                                        }}
                                        screeningSetting={country}
                                        settingList={[]}
                                        placeholder="Select Country"
                                    />
                                </div>
                                <div className={cardStyles.fieldContainer}>
                                    <span>State / Province</span>
                                    <CustomDropdown
                                        onSelectSetting={(province) => {
                                            setProvince(province);
                                            const provinceObj = provinceList.find((p) => p.name === province);
                                            const cities = philippineCitiesAndProvinces.cities
                                                .filter((city) => city.province === provinceObj.key)
                                                .sort((a, b) => a.name.localeCompare(b.name));
                                            setCityList(cities);
                                            setCity(cities[0].name);
                                            if (fieldErrors.province) {
                                                const newErrors = { ...fieldErrors };
                                                delete newErrors.province;
                                                setFieldErrors(newErrors);
                                            }
                                        }}
                                        screeningSetting={province}
                                        settingList={provinceList}
                                        placeholder="Choose state / province"
                                        error={fieldErrors.province}
                                    />
                                    {fieldErrors.province && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.province}
                                        </span>
                                    )}
                                </div>
                                <div className={cardStyles.fieldContainer}>
                                    <span>City</span>
                                    <CustomDropdown
                                        onSelectSetting={(city) => {
                                            setCity(city);
                                            if (fieldErrors.city) {
                                                const newErrors = { ...fieldErrors };
                                                delete newErrors.city;
                                                setFieldErrors(newErrors);
                                            }
                                        }}
                                        screeningSetting={city}
                                        settingList={cityList}
                                        placeholder="Choose city"
                                        allowEmpty={true}
                                        error={fieldErrors.city}
                                    />
                                    {fieldErrors.city && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.city}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <span className={cardStyles.sectionTitle}>Salary</span>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <label className="switch">
                                        <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span>{salaryNegotiable ? "Negotiable" : "Negotiable"}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={cardStyles.fieldContainer}>
                                    <span>Minimum Salary</span>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>P</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ paddingLeft: "28px", border: fieldErrors.minimumSalary ? "1px solid var(--Input-border-destructive, #FDA29B) !important" : undefined }}
                                            placeholder="0"
                                            min={0}
                                            value={minimumSalary}
                                            onChange={(e) => {
                                                setMinimumSalary(e.target.value || "");
                                                if (fieldErrors.minimumSalary) {
                                                    const newErrors = { ...fieldErrors };
                                                    delete newErrors.minimumSalary;
                                                    setFieldErrors(newErrors);
                                                }
                                            }}
                                        />
                                        <span style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
                                    </div>
                                    {fieldErrors.minimumSalary && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.minimumSalary}
                                        </span>
                                    )}
                                </div>
                                <div className={cardStyles.fieldContainer}>
                                    <span>Maximum Salary</span>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>P</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ paddingLeft: "28px", border: fieldErrors.maximumSalary ? "1px solid var(--Input-border-destructive, #FDA29B) !important" : undefined }}
                                            placeholder="0"
                                            min={0}
                                            value={maximumSalary}
                                            onChange={(e) => {
                                                setMaximumSalary(e.target.value || "");
                                                if (fieldErrors.maximumSalary) {
                                                    const newErrors = { ...fieldErrors };
                                                    delete newErrors.maximumSalary;
                                                    setFieldErrors(newErrors);
                                                }
                                            }}
                                        />
                                        <span style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
                                    </div>
                                    {fieldErrors.maximumSalary && (
                                        <span className={errorStyles.errorMessage}>
                                            {fieldErrors.maximumSalary}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>2. Job Description</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div className={cardStyles.fieldContainer}>
                            <RichTextEditor 
                                setText={(text) => {
                                    setDescription(text);
                                    if (fieldErrors.description) {
                                        const newErrors = { ...fieldErrors };
                                        delete newErrors.description;
                                        setFieldErrors(newErrors);
                                    }
                                }} 
                                text={description}
                                error={fieldErrors.description}
                            />
                            {fieldErrors.description && (
                                <span className={errorStyles.errorMessage}>
                                    {fieldErrors.description}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader}>
                        <span className={cardStyles.careerCardTitle}>3. Team Access</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div className={styles.addMembersSection}>
                            <div className={styles.addMembersText}>
                                <span className={cardStyles.sectionTitle}>Add more members</span>
                                <span className={styles.addMembersDescription}>You can add other members to collaborate on this career.</span>
                            </div>
                            <MemberDropdown
                                onSelectMember={(member) => {
                                    setTeamMembers([...teamMembers, {
                                        id: member.id,
                                        name: member.name,
                                        email: member.email,
                                        role: "Contributor",
                                        avatar: member.avatar || "",
                                        isCurrentUser: false
                                    }]);
                                }}
                                existingMemberIds={teamMembers.map(m => m.id)}
                            />
                        </div>

                        <div className={styles.memberList}>
                            {teamMembers.map((member) => (
                                <div key={member.id} className={styles.memberRow}>
                                    <div className={styles.memberInfo}>
                                        <div className={styles.memberAvatar} style={{ backgroundImage: member.avatar ? `url(${member.avatar})` : 'none', backgroundColor: member.avatar ? 'transparent' : '#D7C0DD' }}></div>
                                        <div className={styles.memberDetails}>
                                            <span className={styles.memberName}>{member.name}{member.isCurrentUser ? " (You)" : ""}</span>
                                            <span className={styles.memberEmail}>{member.email}</span>
                                        </div>
                                    </div>
                                    <div className={styles.memberActions}>
                                        <CustomDropdown
                                            onSelectSetting={(role) => {
                                                setTeamMembers(teamMembers.map(m => m.id === member.id ? { ...m, role } : m));
                                            }}
                                            screeningSetting={member.role}
                                            settingList={[
                                                { name: "Job Owner", description: "Full access to manage this career posting, including editing details, viewing candidates, and making hiring decisions." },
                                                { name: "Contributor", description: "Can view and collaborate on this career, but cannot make final hiring decisions or edit core details." }
                                            ]}
                                            placeholder="Select Role"
                                        />
                                        <button
                                            className={styles.deleteMemberButton}
                                            onClick={() => {
                                                if (!member.isCurrentUser) {
                                                    setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                                }
                                            }}
                                            disabled={member.isCurrentUser}
                                        >
                                            <i className="la la-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className={styles.adminNote}>*Admins can view all careers regardless of specific access settings.</p>
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

