"use client"

import { useEffect, useRef, useState } from "react";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import CareerProgressBar from "./CareerProgressBar";
import MemberDropdown from "./MemberDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
  // Setting List icons
  const screeningSettingList = [
    {
        name: "Good Fit and above",
        icon: "la la-check",
    },
    {
        name: "Only Strong Fit",
        icon: "la la-check-double",
    },
    {
        name: "No Automatic Promotion",
        icon: "la la-times",
    },
];
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

export default function CareerForm({ career, formType, setShowEditModal }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void }) {
    const { user, orgID } = useAppContext();
    const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
    const [description, setDescription] = useState(career?.description || "");
    const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
    const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
    const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || "Good Fit and above");
    const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
    const [requireVideo, setRequireVideo] = useState(career?.requireVideo || true);
    const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable || true);
    const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary || "");
    const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary || "");
    const [questions, setQuestions] = useState(career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 2,
        category: "Technical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 5,
        category: "Others",
        questionCountToAsk: null,
        questions: [],
      },
    ]);
    const [country, setCountry] = useState(career?.country || "Philippines");
    const [province, setProvince] = useState(career?.province || "");
    const [city, setCity] = useState(career?.location || "");
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState("");
    const [isSavingCareer, setIsSavingCareer] = useState(false);
    const savingCareerRef = useRef(false);
    const [teamMembers, setTeamMembers] = useState(career?.teamMembers || [
        {
            id: 1,
            name: "Sabine Beatrix Dy",
            email: "sabine@whitecloak.com",
            role: "Job Owner",
            avatar: "",
            isCurrentUser: true
        },
        {
            id: 2,
            name: "Darlene Santo Tomas",
            email: "darlene@whitecloak.com",
            role: "Contributor",
            avatar: "",
            isCurrentUser: false
        }
    ]);

    const isFormValid = () => {
        return jobTitle?.trim().length > 0 && description?.trim().length > 0 && questions.some((q) => q.questions.length > 0) && workSetup?.trim().length > 0;
    }

    const updateCareer = async (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
            errorToast("Minimum salary cannot be greater than maximum salary", 1300);
            return;
        }
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const updatedCareer = {
            _id: career._id,
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: userInfoSlice,
            status,
            updatedAt: Date.now(),
            screeningSetting,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            employmentType,
        }
        try {
            setIsSavingCareer(true);
            const response = await axios.post("/api/update-career", updatedCareer);
            if (response.status === 200) {
                candidateActionToast(
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career updated</span>
                    </div>,
                    1300,
                <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
                setTimeout(() => {
                    window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
                }, 1300);
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to update career", 1300);
        } finally {
            setIsSavingCareer(false);
        }
    }

  
    const confirmSaveCareer = (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
        errorToast("Minimum salary cannot be greater than maximum salary", 1300);
        return;
        }

        setShowSaveModal(status);
    }

    const saveCareer = async (status: string) => {
        setShowSaveModal("");
        if (!status) {
          return;
        }

        if (!savingCareerRef.current) {
        setIsSavingCareer(true);
        savingCareerRef.current = true;
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const career = {
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
            screeningSetting,
            orgID,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            status,
            employmentType,
            teamMembers,
        }

        try {
            
            const response = await axios.post("/api/add-career", career);
            if (response.status === 200) {
            candidateActionToast(
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career added {status === "active" ? "and published" : ""}</span>
                </div>,
                1300, 
            <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
            setTimeout(() => {
                window.location.href = `/recruiter-dashboard/careers`;
            }, 1300);
            }
        } catch (error) {
            errorToast("Failed to add career", 1300);
        } finally {
            savingCareerRef.current = false;
            setIsSavingCareer(false);
        }
      }
    }

    useEffect(() => {
        const parseProvinces = () => {
          setProvinceList(philippineCitiesAndProvinces.provinces);
          const defaultProvince = philippineCitiesAndProvinces.provinces[0];
          if (career?.province) {
            const selectedProvince = philippineCitiesAndProvinces.provinces.find(p => p.name === career.province);
            if (selectedProvince) {
              const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === selectedProvince.key);
              setCityList(cities);
            }
          } else {
            // Load cities for default province so city dropdown has items even when province is not selected
            const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === defaultProvince.key);
            setCityList(cities);
          }
        }
        parseProvinces();
      },[career])

    return (
        <div className="col">
        {formType === "add" ? (<div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Add new career</h1>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  <button
                  disabled={!isFormValid() || isSavingCareer}
                   style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                    confirmSaveCareer("inactive");
                      }}>
                          Save as Unpublished
                  </button>
                  <button 
                  disabled={!isFormValid() || isSavingCareer}
                  style={{ width: "fit-content", background: !isFormValid() || isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                    confirmSaveCareer("active");
                  }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                      Save as Published
                  </button>
                </div>
        </div>) : null}
        {formType === "add" && <CareerProgressBar />}
        {formType === "add" && <div className={styles.contentDivider}></div>}
        {formType === "edit" && (
            <div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Edit Career Details</h1>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <button
                 style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => {
                  setShowEditModal?.(false);
                    }}>
                        Cancel
                </button>
                <button
                  disabled={!isFormValid() || isSavingCareer}
                   style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                    updateCareer("inactive");
                    }}>
                          Save Changes as Unpublished
                  </button>
                  <button 
                  disabled={!isFormValid() || isSavingCareer}
                  style={{ width: "fit-content", background: !isFormValid() || isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                    updateCareer("active");
                  }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                      Save Changes as Published
                  </button>
              </div>
       </div>
        )}
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

          <InterviewQuestionGeneratorV2 questions={questions} setQuestions={(questions) => setQuestions(questions)} jobTitle={jobTitle} description={description} />
        </div>

        <div className={styles.rightContainer}>
        <div className="layered-card-middle">
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="la la-cog" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                  </div>
                      <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Settings</span>
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
                      <div style={{ display: "flex", flexDirection: "row",justifyContent: "space-between", gap: 8 }}>
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
      {showSaveModal && (
         <CareerActionModal action={showSaveModal} onAction={(action) => saveCareer(action)} />
        )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation title={formType === "add" ? "Saving career..." : "Updating career..."} subtext={`Please wait while we are ${formType === "add" ? "saving" : "updating"} the career`} />
      )}
    </div>
    )
}