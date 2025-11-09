"use client";

import styles from "@/lib/styles/screens/uploadCV.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";
import axios from "axios";
import { useState, useEffect } from "react";
import CareerDropdown from "@/lib/components/Dropdown/CareerDropdown";

interface CVScreeningProps {
  interview: any;
  user: any;
  userCV: any;
  digitalCV: string | null;
  file: any;
  hasChanges: boolean;
  setHasChanges: (value: boolean) => void;
  step: string[];
  processState: (index: number, isAdvance?: boolean) => string;
  assetConstants: any;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  onScreeningStart: () => void;
  onScreeningComplete: (result: any) => void;
  onGoToDashboard: () => void;
  onStartInterview: () => void;
}

export default function CVScreening({
  interview,
  user,
  userCV,
  digitalCV,
  file,
  hasChanges,
  setHasChanges,
  step,
  processState,
  assetConstants,
  currentStep,
  setCurrentStep,
  onScreeningStart,
  onScreeningComplete,
  onGoToDashboard,
  onStartInterview,
}: CVScreeningProps) {
  const [isScreening, setIsScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>([]);
  const [preScreeningQuestionOptions, setPreScreeningQuestionOptions] = useState<{[questionId: string]: {id: string, value: string, number: number}[]}>({});
  const [preScreeningQuestionSalaryRanges, setPreScreeningQuestionSalaryRanges] = useState<{[questionId: string]: {minimum: string, maximum: string}}>({});
  const [questionAnswers, setQuestionAnswers] = useState<{[questionId: string]: any}>({});
  const [loadingPreScreeningQuestions, setLoadingPreScreeningQuestions] = useState(true);

  const cvSections = [
    "Introduction",
    "Current Position",
    "Contact Info",
    "Skills",
    "Experience",
    "Education",
    "Projects",
    "Certifications",
    "Awards",
  ];

  // Fetch pre-screening questions when component mounts
  useEffect(() => {
    if (interview?.id) {
      setLoadingPreScreeningQuestions(true);
      // Try the dedicated endpoint first, fallback to fetch-career-data if needed
      axios({
        method: "POST",
        url: "/api/fetch-pre-screening-questions",
        data: { careerId: interview.id },
      })
        .then((res) => {
          if (res.data.preScreeningQuestions) {
            console.log("Fetched pre-screening questions:", res.data.preScreeningQuestions);
            console.log("Fetched question options:", res.data.preScreeningQuestionOptions);
            setPreScreeningQuestions(res.data.preScreeningQuestions || []);
            setPreScreeningQuestionOptions(res.data.preScreeningQuestionOptions || {});
            setPreScreeningQuestionSalaryRanges(res.data.preScreeningQuestionSalaryRanges || {});
          }
          setLoadingPreScreeningQuestions(false);
        })
        .catch((err) => {
          console.error("Error fetching pre-screening questions:", err);
          // Fallback: try fetching from career data if the dedicated route doesn't work
          if (interview?.id) {
            axios({
              method: "POST",
              url: "/api/fetch-career-data",
              data: { careerId: interview.id, preScreeningOnly: true },
            })
              .then((res) => {
                if (res.data.preScreeningQuestions) {
                  setPreScreeningQuestions(res.data.preScreeningQuestions || []);
                  setPreScreeningQuestionOptions(res.data.preScreeningQuestionOptions || {});
                  setPreScreeningQuestionSalaryRanges(res.data.preScreeningQuestionSalaryRanges || {});
                }
                setLoadingPreScreeningQuestions(false);
              })
              .catch((fallbackErr) => {
                console.error("Error fetching pre-screening questions from fallback:", fallbackErr);
                setLoadingPreScreeningQuestions(false);
              });
          } else {
            setLoadingPreScreeningQuestions(false);
          }
        });
    } else {
      setLoadingPreScreeningQuestions(false);
    }
  }, [interview?.id, interview?._id]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const renderQuestionInput = (question: any) => {
    const questionId = question.id;
    const questionType = question.type || "Dropdown";
    const options = preScreeningQuestionOptions[questionId] || [];
    const salaryRange = preScreeningQuestionSalaryRanges[questionId];
    const answer = questionAnswers[questionId] || "";
    
    // Debug logging for custom questions
    if (!question.title && (questionType === "Dropdown" || questionType === "Checkboxes")) {
      console.log(`Custom question ${questionId} (type: ${questionType}) has ${options.length} options:`, options);
    }

    switch (questionType) {
      case "Short Answer":
        return (
          <input
            type="text"
            className={styles.questionInput}
            value={answer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder="Enter your answer"
          />
        );
      case "Long Answer":
        return (
          <textarea
            className={styles.questionTextarea}
            value={answer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder="Enter your answer"
            rows={4}
          />
        );
      case "Dropdown":
        return (
          <div style={{ width: "320px" }}>
            <CareerDropdown
              questionId={questionId}
              options={options}
              value={answer}
              onChange={(value) => handleAnswerChange(questionId, value)}
            />
          </div>
        );
      case "Checkboxes":
        return (
          <div className={styles.checkboxContainer}>
            {options.map((option: any) => {
              const isChecked = Array.isArray(answer) && answer.includes(option.value);
              return (
                <label key={option.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(answer) ? answer : [];
                      if (e.target.checked) {
                        handleAnswerChange(questionId, [...currentAnswers, option.value]);
                      } else {
                        handleAnswerChange(questionId, currentAnswers.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <span>{option.value}</span>
                </label>
              );
            })}
          </div>
        );
      case "Range":
        return (
          <div className={styles.rangeContainer} style={{ flexDirection: "row", gap: "12px" }}>
            <div className={cardStyles.fieldContainer}>
              <span>Minimum</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>₱</span>
                <input
                  type="number"
                  className={`form-control ${cardStyles.salaryInput}`}
                  style={{ 
                    paddingLeft: "28px", 
                    paddingRight: "35px"
                  }}
                  placeholder={salaryRange?.minimum || "0"}
                  min={0}
                  value={answer.minimum || ""}
                  onChange={(e) => handleAnswerChange(questionId, { ...answer, minimum: e.target.value })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
              </div>
            </div>
            <div className={cardStyles.fieldContainer}>
              <span>Maximum</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>₱</span>
                <input
                  type="number"
                  className={`form-control ${cardStyles.salaryInput}`}
                  style={{ 
                    paddingLeft: "28px", 
                    paddingRight: "35px"
                  }}
                  placeholder={salaryRange?.maximum || "0"}
                  min={0}
                  value={answer.maximum || ""}
                  onChange={(e) => handleAnswerChange(questionId, { ...answer, maximum: e.target.value })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ width: "320px" }}>
            <CareerDropdown
              questionId={questionId}
              options={options}
              value={answer}
              onChange={(value) => handleAnswerChange(questionId, value)}
            />
          </div>
        );
    }
  };

  // Check if all pre-screening questions are answered
  const areAllQuestionsAnswered = () => {
    if (preScreeningQuestions.length === 0) {
      return true; // No questions means they're all "answered"
    }

    return preScreeningQuestions.every((question) => {
      const questionId = question.id;
      const questionType = question.type || "Dropdown";
      const answer = questionAnswers[questionId];

      if (!answer) {
        return false;
      }

      switch (questionType) {
        case "Short Answer":
        case "Long Answer":
          return typeof answer === "string" && answer.trim() !== "";
        case "Dropdown":
          return typeof answer === "string" && answer !== "";
        case "Checkboxes":
          return Array.isArray(answer) && answer.length > 0;
        case "Range":
          return (
            typeof answer === "object" &&
            answer.minimum !== undefined &&
            answer.maximum !== undefined &&
            answer.minimum !== "" &&
            answer.maximum !== ""
          );
        default:
          return typeof answer === "string" && answer !== "";
      }
    });
  };

  const isContinueDisabled = !areAllQuestionsAnswered();

  function handleStartScreening() {
    if (!userCV) {
      alert("No CV data available.");
      return false;
    }

    const allEmpty = Object.values(userCV).every(
      (value: any) => value.trim() == ""
    );

    if (allEmpty) {
      alert("No details to be saved.");
      return false;
    }

    let parsedDigitalCV = {
      errorRemarks: null,
      digitalCV: null,
    };

    if (digitalCV) {
      parsedDigitalCV = JSON.parse(digitalCV);

      if (parsedDigitalCV.errorRemarks) {
        alert(
          "Please fix the errors in the CV first.\n\n" +
            parsedDigitalCV.errorRemarks
        );
        return false;
      }
    }

    setIsScreening(true);
    onScreeningStart(); // Notify parent that screening has started

    // Save pre-screening question answers to interview
    if (Object.keys(questionAnswers).length > 0) {
      axios({
        method: "POST",
        url: "/api/whitecloak/manage-application",
        data: {
          interviewData: { _id: interview._id },
          email: user.email,
          body: {
            preScreeningAnswers: questionAnswers,
          },
        },
      })
        .catch((err) => {
          console.error("Error saving pre-screening answers:", err);
        });
    }

    // Save CV if there are changes
    if (hasChanges) {
      const formattedUserCV = cvSections.map((section) => ({
        name: section,
        content: userCV[section]?.trim() || "",
      }));

      parsedDigitalCV.digitalCV = formattedUserCV;

      const data = {
        name: user.name,
        cvData: parsedDigitalCV,
        email: user.email,
        fileInfo: null,
      };

      if (file) {
        data.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }

      axios({
        method: "POST",
        url: `/api/whitecloak/save-cv`,
        data,
      })
        .then(() => {
          localStorage.setItem(
            "userCV",
            JSON.stringify({ ...data, ...data.cvData })
          );
        })
        .catch((err) => {
          alert("Error saving CV. Please try again.");
          setIsScreening(false);
          onScreeningComplete(null); // Reset screening state on error
          console.log(err);
        });
    }

    // Start pre-screening questions
    axios({
      url: "/api/whitecloak/screen-cv",
      method: "POST",
      data: {
        interviewID: interview.interviewID,
        userEmail: user.email,
      },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.message);
          setIsScreening(false);
          onScreeningComplete(null); // Reset screening state on error
        } else {
          setScreeningResult(result);
          onScreeningComplete(result);
          setIsScreening(false);
          setHasChanges(false);
        }
      })
      .catch((err) => {
        alert("Error screening CV. Please try again.");
        setIsScreening(false);
        onScreeningComplete(null); // Reset screening state on error
        console.log(err);
      })
      .finally(() => {
        setHasChanges(false);
      });
  }

  return (
    <>
      <div className={styles.cvScreeningPage}>
        <div className={styles.cvScreeningMainContainer}>
          <div className={styles.uploadCVHeader}>
            {interview.organization && interview.organization.image && (
              <img alt="" src={interview.organization.image} />
            )}
            <div className={styles.textContainer}>
              <span className={styles.tag}>You're applying for</span>
              <span className={styles.title}>{interview.jobTitle}</span>
              {interview.organization && interview.organization.name && (
                <span className={styles.name}>
                  {interview.organization.name}
                </span>
              )}
              <span className={styles.description}>
                View job description
              </span>
            </div>
          </div>

          <div className={styles.stepContainer}>
            <div className={styles.step}>
              {step.map((_, index) => (
                <div 
                  className={styles.stepBar} 
                  key={index}
                >
                  <img
                    alt=""
                    src={
                      assetConstants[
                        processState(index, true)
                          .toLowerCase()
                          .replace(" ", "_")
                      ]
                    }
                  />
                  {index < step.length - 1 && (
                    <hr
                      className={
                        styles[
                          processState(index).toLowerCase().replace(" ", "_")
                        ]
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.step}>
              {step.map((item, index) => (
                <span
                  className={`${styles.stepDetails} ${
                    styles[
                      processState(index, true).toLowerCase().replace(" ", "_")
                    ]
                  }`}
                  key={index}
                >
                  {item === "Review Next Steps" ? "Review" : item}
                </span>
              ))}
            </div>
          </div>

          {isScreening ? (
            <div className={styles.cvScreeningContainer}>
              <img alt="" src={assetConstants.loading} />
              <span className={styles.title}>Sit tight!</span>
              <span className={styles.description}>
                Our smart reviewer is checking your qualifications.
              </span>
              <span className={styles.description}>
                We'll let you know what's next in just a moment.
              </span>
            </div>
          ) : screeningResult ? (
            <div className={styles.cvResultContainer}>
              {screeningResult.applicationStatus == "Dropped" ? (
                <>
                  <img alt="" src={assetConstants.userRejected} />
                  <span className={styles.title}>
                    This role may not be the best match.
                  </span>
                  <span className={styles.description}>
                    Based on your CV, it looks like this position might not be the
                    right fit at the moment.
                  </span>
                  <br />
                  <span className={styles.description}>
                    Review your screening results and see recommended next steps.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={onGoToDashboard}>View Dashboard</button>
                  </div>
                </>
              ) : screeningResult.status == "For AI Interview" ? (
                <>
                  <img alt="" src={assetConstants.checkV3} />
                  <span className={styles.title}>
                    Hooray! You're a strong fit for this role.
                  </span>
                  <span className={styles.description}>
                    Jia thinks you might be a great match.
                  </span>
                  <br />
                  <span className={`${styles.description} ${styles.bold}`}>
                    Ready to take the next step?
                  </span>
                  <span className={styles.description}>
                    You may start your AI interview now.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={onStartInterview}>Start AI Interview</button>
                    <button className="secondaryBtn" onClick={onGoToDashboard}>
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img alt="" src={assetConstants.userCheck} />
                  <span className={styles.title}>Your CV has been screened.</span>
                  <span className={styles.description}>
                    Your CV is now being reviewed by the hiring team.
                  </span>
                  <span className={styles.description}>
                    We'll be in touch soon with updates about your application.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={onGoToDashboard}>View Dashboard</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className={styles.cvScreeningContent}>
                <span className={styles.title}>Quick Pre-screening</span>
                <span className={styles.description}>Just a few short questions to help your recruiters assess you faster. Takes less than a minute.</span>
              </div>

              <div className={styles.cvScreeningQuestionsContainer}>
                {loadingPreScreeningQuestions ? null : (
                  preScreeningQuestions.length > 0 ? (
                    preScreeningQuestions.map((question, index) => (
                      <div key={question.id} className={styles.cvDetailsContainer}>
                        <div className={styles.gradient}>
                          <div className={styles.cvDetailsCard}>
                            <span className={styles.sectionTitle}>
                              {question.description || `Question ${index + 1}`}
                            </span>
                            <div className={styles.detailsContainer}>
                              {renderQuestionInput(question)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.cvDetailsContainer}>
                      <div className={styles.gradient}>
                        <div className={styles.cvDetailsCard}>
                          <span className={styles.sectionTitle}>
                            No pre-screening questions
                          </span>
                          <div className={styles.detailsContainer}>
                            <p>There are no pre-screening questions for this position.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className={styles.cvScreeningButtonContainer}>
                <button 
                  onClick={handleStartScreening} 
                  className={styles.continueButton}
                  disabled={isContinueDisabled}
                  style={isContinueDisabled ? {
                    background: "var(--Button-bg-primary_disabled, #D5D7DA)",
                    border: "1px solid var(--Button-bg-primary_disabled, #D5D7DA)",
                    cursor: "not-allowed"
                  } : undefined}
                >
                  Continue
                  <span className={styles.iconContainer}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.835938 6.66836H12.5026M12.5026 6.66836L6.66927 0.835022M12.5026 6.66836L6.66927 12.5017" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

