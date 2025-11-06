"use client"

import { useState, useEffect } from "react";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import MemberDropdown from "./MemberDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";

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
}: CareerContentDetailsProps) {
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        const parseProvinces = () => {
            setProvinceList(philippineCitiesAndProvinces.provinces);
            const defaultProvince = philippineCitiesAndProvinces.provinces[0];
            if (province) {
                const selectedProvince = philippineCitiesAndProvinces.provinces.find(p => p.name === province);
                if (selectedProvince) {
                    const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === selectedProvince.key);
                    setCityList(cities);
                }
            } else {
                const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === defaultProvince.key);
                setCityList(cities);
            }
        }
        parseProvinces();
    }, [province]);

    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.careerCard}>
                    <div className={styles.careerCardHeader}>
                        <span className={styles.careerCardTitle}>1. Career Information</span>
                    </div>
                    <div className={styles.careerCardContent}>
                        <div className={styles.basicInfoContainer}>
                            <span className={styles.sectionTitle}>Basic Information</span>
                            <div className={styles.jobTitleField}>
                                <span>Job Title</span>
                                <input
                                    value={jobTitle}
                                    className="form-control"
                                    placeholder="Enter job title"
                                    onChange={(e) => {
                                        setJobTitle(e.target.value || "");
                                    }}
                                ></input>
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <span className={styles.sectionTitle}>Work Setting</span>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={styles.fieldContainer}>
                                    <span>Employment Type</span>
                                    <CustomDropdown
                                        onSelectSetting={(employmentType) => {
                                            setEmploymentType(employmentType);
                                        }}
                                        screeningSetting={employmentType}
                                        settingList={employmentTypeOptions}
                                        placeholder="Choose employment type"
                                    />
                                </div>
                                <div className={styles.fieldContainer}>
                                    <span>Arrangement</span>
                                    <CustomDropdown
                                        onSelectSetting={(setting) => {
                                            setWorkSetup(setting);
                                        }}
                                        screeningSetting={workSetup}
                                        settingList={workSetupOptions}
                                        placeholder="Choose work arrangement"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <span className={styles.sectionTitle}>Location</span>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={styles.fieldContainer}>
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
                                <div className={styles.fieldContainer}>
                                    <span>State / Province</span>
                                    <CustomDropdown
                                        onSelectSetting={(province) => {
                                            setProvince(province);
                                            const provinceObj = provinceList.find((p) => p.name === province);
                                            const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === provinceObj.key);
                                            setCityList(cities);
                                            setCity(cities[0].name);
                                        }}
                                        screeningSetting={province}
                                        settingList={provinceList}
                                        placeholder="Choose state / province"
                                    />
                                </div>
                                <div className={styles.fieldContainer}>
                                    <span>City</span>
                                    <CustomDropdown
                                        onSelectSetting={(city) => {
                                            setCity(city);
                                        }}
                                        screeningSetting={city}
                                        settingList={cityList}
                                        placeholder="Choose city"
                                        allowEmpty={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.sectionContainer}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <span className={styles.sectionTitle}>Salary</span>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <label className="switch">
                                        <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span>{salaryNegotiable ? "Negotiable" : "Negotiable"}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                                <div className={styles.fieldContainer}>
                                    <span>Minimum Salary</span>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>P</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ paddingLeft: "28px" }}
                                            placeholder="0"
                                            min={0}
                                            value={minimumSalary}
                                            onChange={(e) => {
                                                setMinimumSalary(e.target.value || "");
                                            }}
                                        />
                                        <span style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
                                    </div>
                                </div>
                                <div className={styles.fieldContainer}>
                                    <span>Maximum Salary</span>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>P</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ paddingLeft: "28px" }}
                                            placeholder="0"
                                            min={0}
                                            value={maximumSalary}
                                            onChange={(e) => {
                                                setMaximumSalary(e.target.value || "");
                                            }}
                                        />
                                        <span style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.careerCard}>
                    <div className={styles.careerCardHeader}>
                        <span className={styles.careerCardTitle}>2. Job Description</span>
                    </div>
                    <div className={styles.careerCardContent}>
                        <RichTextEditor setText={setDescription} text={description} />
                    </div>
                </div>

                <div className={styles.careerCard}>
                    <div className={styles.careerCardHeader}>
                        <span className={styles.careerCardTitle}>3. Team Access</span>
                    </div>
                    <div className={styles.careerCardContent}>
                        <div className={styles.addMembersSection}>
                            <div className={styles.addMembersText}>
                                <span className={styles.sectionTitle}>Add more members</span>
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
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="la la-cog" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                        </div>
                        <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Settings</span>
                    </div>
                    <div className="layered-card-content">
                        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                            <i className="la la-id-badge" style={{ color: "#414651", fontSize: 20 }}></i>
                            <span>Screening Setting</span>
                        </div>
                        <CustomDropdown
                            onSelectSetting={(setting) => {
                                setScreeningSetting(setting);
                            }}
                            screeningSetting={screeningSetting}
                            settingList={screeningSettingList}
                        />
                        <span>This settings allows Jia to automatically endorse candidates who meet the chosen criteria.</span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                                <i className="la la-video" style={{ color: "#414651", fontSize: 20 }}></i>
                                <span>Require Video Interview</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
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
        </div>
    );
}

