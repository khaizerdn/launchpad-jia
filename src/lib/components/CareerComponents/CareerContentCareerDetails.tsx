"use client"

import { useState, useEffect } from "react";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CareerDropdown from "@/lib/components/Dropdown/CareerDropdown";
import CareerInputField from "@/lib/components/InputField/CareerInputField";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import CareerMemberDropdown from "@/lib/components/Dropdown/CareerMemberDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import errorStyles from "@/lib/styles/components/careerErrorField.module.scss";

const workSetupOptions = [{ name: "Fully Remote" }, { name: "Onsite" }, { name: "Hybrid" }];
const employmentTypeOptions = [{ name: "Full-Time" }, { name: "Part-Time" }];
const countryOptions = [{ name: "Philippines" }];

interface CareerContentCareerDetailsProps {
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

export default function CareerContentCareerDetails({
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
}: CareerContentCareerDetailsProps) {
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);

    // Initialize country to "Philippines" if empty
    useEffect(() => {
        if (!country) {
            setCountry("Philippines");
        }
    }, []);

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
                                <CareerInputField
                                    value={jobTitle}
                                    onChange={(value) => setJobTitle(value)}
                                    placeholder="Enter job title"
                                    error={fieldErrors.jobTitle}
                                    onErrorClear={() => {
                                        const newErrors = { ...fieldErrors };
                                        delete newErrors.jobTitle;
                                        setFieldErrors(newErrors);
                                    }}
                                />
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
                                    <CareerDropdown
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
                                    <CareerDropdown
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
                                    <CareerDropdown
                                        onSelectSetting={(setting) => {
                                            setCountry(setting);
                                        }}
                                        screeningSetting={country}
                                        settingList={countryOptions}
                                        placeholder="Select Country"
                                    />
                                </div>
                                <div className={cardStyles.fieldContainer}>
                                    <span>State / Province</span>
                                    <CareerDropdown
                                        onSelectSetting={(province) => {
                                            setProvince(province);
                                            const provinceObj = provinceList.find((p) => p.name === province);
                                            const cities = philippineCitiesAndProvinces.cities
                                                .filter((city) => city.province === provinceObj.key)
                                                .sort((a, b) => a.name.localeCompare(b.name));
                                            setCityList(cities);
                                            setCity(""); // Clear city when province changes
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
                                    <CareerDropdown
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
                                            className={`form-control ${cardStyles.salaryInput}`}
                                            style={{ paddingLeft: "28px", paddingRight: fieldErrors.minimumSalary ? "60px" : "35px", border: fieldErrors.minimumSalary ? "1px solid var(--Input-border-destructive, #FDA29B) !important" : undefined }}
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
                                            onWheel={(e) => e.currentTarget.blur()}
                                        />
                                        {fieldErrors.minimumSalary && (
                                            <div style={{ position: "absolute", right: "50px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                                <img alt="" src="/iconsV3/alertV2.svg" />
                                            </div>
                                        )}
                                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
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
                                            className={`form-control ${cardStyles.salaryInput}`}
                                            style={{ paddingLeft: "28px", paddingRight: fieldErrors.maximumSalary ? "60px" : "35px", border: fieldErrors.maximumSalary ? "1px solid var(--Input-border-destructive, #FDA29B) !important" : undefined }}
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
                                            onWheel={(e) => e.currentTarget.blur()}
                                        />
                                        {fieldErrors.maximumSalary && (
                                            <div style={{ position: "absolute", right: "50px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                                <img alt="" src="/iconsV3/alertV2.svg" />
                                            </div>
                                        )}
                                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
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
                            <CareerMemberDropdown
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

                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>

                        {!teamMembers.some(member => member.role === "Job Owner") && (
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "0px", gap: "8px" }}>
                                <img alt="" src="/iconsV3/alertV3.svg" />
                                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: 'var(--Text-text-error, #D92D20)' }}>
                                    Career must have a job owner. Please assign a job owner.
                                </span>
                            </div>
                        )}

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
                                        <CareerDropdown
                                            onSelectSetting={(role) => {
                                                setTeamMembers(teamMembers.map(m => m.id === member.id ? { ...m, role } : m));
                                                // Clear job owner error if a job owner is now assigned
                                                if (role === "Job Owner" && fieldErrors.jobOwner) {
                                                    const newErrors = { ...fieldErrors };
                                                    delete newErrors.jobOwner;
                                                    setFieldErrors(newErrors);
                                                }
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
                                                    const updatedMembers = teamMembers.filter(m => m.id !== member.id);
                                                    setTeamMembers(updatedMembers);
                                                    // If deleted member was the only job owner, the error will show on next validation
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

