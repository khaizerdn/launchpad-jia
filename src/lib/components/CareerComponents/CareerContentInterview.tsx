"use client"

import { useState, useRef, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import preScreeningStyles from "@/lib/styles/components/careerPreScreeningQuestions.module.scss";

interface CareerContentInterviewProps {
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    screeningSettingList: any[];
    requireVideo: boolean;
    setRequireVideo: (value: boolean) => void;
    aiInterviewSecretPrompt: string;
    setAiInterviewSecretPrompt: (value: string) => void;
    interviewQuestions: {[category: string]: {id: string, text: string, isEditing: boolean}[]};
    setInterviewQuestions: (questions: {[category: string]: {id: string, text: string, isEditing: boolean}[]}) => void;
    fieldErrors: {[key: string]: string};
}

interface SortableInterviewQuestionItemProps {
    question: { id: string; text: string; isEditing: boolean };
    category: string;
    onDelete: (category: string, questionId: string) => void;
    onUpdate: (category: string, questionId: string, text: string) => void;
    onEdit: (category: string, questionId: string) => void;
    sensors: any;
}

function SortableInterviewQuestionItem({ question, category, onDelete, onUpdate, onEdit, sensors }: SortableInterviewQuestionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [localText, setLocalText] = useState(question.text);

    useEffect(() => {
        setLocalText(question.text);
    }, [question.text]);

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 'var(--padding-sm, 8px)',
                gap: 'var(--spacing-md, 16px)',
                border: '1px solid var(--Border-primary, #E9EAEB)',
                borderRadius: '12px',
                background: 'transparent',
                width: '100%'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-xs, 4px)', flex: 1 }}>
                <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33333 11.6667C3.33333 12.5833 2.58333 13.3333 1.66667 13.3333C0.75 13.3333 0 12.5833 0 11.6667C0 10.75 0.75 10 1.66667 10C2.58333 10 3.33333 10.75 3.33333 11.6667ZM1.66667 5C0.75 5 0 5.75 0 6.66667C0 7.58333 0.75 8.33333 1.66667 8.33333C2.58333 8.33333 3.33333 7.58333 3.33333 6.66667C3.33333 5.75 2.58333 5 1.66667 5ZM1.66667 0C0.75 0 0 0.75 0 1.66667C0 2.58333 0.75 3.33333 1.66667 3.33333C2.58333 3.33333 3.33333 2.58333 3.33333 1.66667C3.33333 0.75 2.58333 0 1.66667 0ZM6.66667 3.33333C7.58333 3.33333 8.33333 2.58333 8.33333 1.66667C8.33333 0.75 7.58333 0 6.66667 0C5.75 0 5 0.75 5 1.66667C5 2.58333 5.75 3.33333 6.66667 3.33333ZM6.66667 5C5.75 5 5 5.75 5 6.66667C5 7.58333 5.75 8.33333 6.66667 8.33333C7.58333 8.33333 8.33333 7.58333 8.33333 6.66667C8.33333 5.75 7.58333 5 6.66667 5ZM6.66667 10C5.75 10 5 10.75 5 11.6667C5 12.5833 5.75 13.3333 6.66667 13.3333C7.58333 13.3333 8.33333 12.5833 8.33333 11.6667C8.33333 10.75 7.58333 10 6.66667 10Z" fill="#A4A7AE"/>
                    </svg>
                </div>
                {question.isEditing ? (
                    <input
                        type="text"
                        className={preScreeningStyles.questionInput}
                        value={localText}
                        onChange={(e) => setLocalText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onUpdate(category, question.id, localText);
                            }
                            if (e.key === 'Escape') {
                                setLocalText(question.text);
                                onUpdate(category, question.id, question.text);
                            }
                        }}
                        autoFocus
                        placeholder="Enter question..."
                        style={{
                            height: '40px',
                            border: '1px solid var(--Input-border-primary, #E9EAEB)',
                            borderRadius: '8px',
                            boxShadow: '0px 1px 2px 0px #0A0D120D',
                            padding: '10px 14px',
                            background: 'var(--Input-bg-primary, #FFFFFF)',
                            color: 'var(--Input-text-primary, #181D27)'
                        }}
                    />
                ) : (
                    <span style={{
                        fontFamily: 'Satoshi',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '0%',
                        color: 'var(--Text-text-secondary, #414651)',
                        flex: 1
                    }}>
                        {question.text}
                    </span>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-sm, 8px)' }}>
                <button
                    className={preScreeningStyles.addQuestionButton}
                    style={{
                        height: '36px',
                        padding: '8px 14px'
                    }}
                    onMouseDown={(e) => {
                        if (question.isEditing) {
                            e.preventDefault();
                            onUpdate(category, question.id, localText);
                        } else {
                            onEdit(category, question.id);
                        }
                    }}
                >
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.335 1.52532C13.5538 1.30645 13.8137 1.13283 14.0996 1.01438C14.3856 0.895927 14.6921 0.834961 15.0016 0.834961C15.3112 0.834961 15.6177 0.895927 15.9036 1.01438C16.1896 1.13283 16.4494 1.30645 16.6683 1.52532C16.8872 1.74419 17.0608 2.00402 17.1792 2.28999C17.2977 2.57596 17.3587 2.88245 17.3587 3.19198C17.3587 3.50151 17.2977 3.80801 17.1792 4.09398C17.0608 4.37994 16.8872 4.63978 16.6683 4.85865L5.41829 16.1086L0.834961 17.3586L2.08496 12.7753L13.335 1.52532Z" stroke="#535862" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span style={{
                        fontFamily: 'Satoshi',
                        fontWeight: 700,
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0%',
                        color: 'var(--Button-text-secondary, #414651)'
                    }}>
                        {question.isEditing ? 'Save' : 'Edit'}
                    </span>
                </button>
                <button
                    className={preScreeningStyles.deleteQuestionButton}
                    onClick={() => onDelete(category, question.id)}
                    style={{ 
                        width: '36px',
                        height: '36px',
                        padding: '0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.834961 4.16829H2.50163M2.50163 4.16829H15.835M2.50163 4.16829V15.835C2.50163 16.277 2.67722 16.7009 2.98978 17.0135C3.30234 17.326 3.72627 17.5016 4.16829 17.5016H12.5016C12.9437 17.5016 13.3676 17.326 13.6801 17.0135C13.9927 16.7009 14.1683 16.277 14.1683 15.835V4.16829H2.50163ZM5.00163 4.16829V2.50163C5.00163 2.0596 5.17722 1.63568 5.48978 1.32312C5.80234 1.01056 6.22627 0.834961 6.66829 0.834961H10.0016C10.4437 0.834961 10.8676 1.01056 11.1801 1.32312C11.4927 1.63568 11.6683 2.0596 11.6683 2.50163V4.16829M6.66829 8.33496V13.335M10.0016 8.33496V13.335" stroke="#B32318" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function CareerContentInterview({
    screeningSetting,
    setScreeningSetting,
    screeningSettingList,
    requireVideo,
    setRequireVideo,
    aiInterviewSecretPrompt,
    setAiInterviewSecretPrompt,
    interviewQuestions: parentInterviewQuestions,
    setInterviewQuestions: setParentInterviewQuestions,
    fieldErrors,
}: CareerContentInterviewProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const aiInterviewSecretPromptRef = useRef<HTMLDivElement>(null);
    const [interviewQuestions, setInterviewQuestions] = useState<{[category: string]: {id: string, text: string, isEditing: boolean}[]}>(parentInterviewQuestions);
    
    // Sync local state with parent state when parent changes
    useEffect(() => {
        setInterviewQuestions(parentInterviewQuestions);
    }, [parentInterviewQuestions]);
    
    // Helper function to update both local and parent state
    const updateInterviewQuestions = (newQuestions: {[category: string]: {id: string, text: string, isEditing: boolean}[]}) => {
        setInterviewQuestions(newQuestions);
        setParentInterviewQuestions(newQuestions);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddQuestion = (category: string) => {
        const newQuestion = {
            id: Date.now().toString(),
            text: '',
            isEditing: true
        };
        const updated = {
            ...interviewQuestions,
            [category]: [...(interviewQuestions[category] || []), newQuestion]
        };
        updateInterviewQuestions(updated);
    };

    const handleDeleteQuestion = (category: string, questionId: string) => {
        const updated = {
            ...interviewQuestions,
            [category]: (interviewQuestions[category] || []).filter(q => q.id !== questionId)
        };
        updateInterviewQuestions(updated);
    };

    const handleUpdateQuestion = (category: string, questionId: string, text: string) => {
        if (!text.trim()) {
            // If text is empty, don't save and keep editing
            return;
        }
        const updated = {
            ...interviewQuestions,
            [category]: (interviewQuestions[category] || []).map(q => 
                q.id === questionId ? { ...q, text: text.trim(), isEditing: false } : q
            )
        };
        updateInterviewQuestions(updated);
    };

    const handleEditQuestion = (category: string, questionId: string) => {
        const updated = {
            ...interviewQuestions,
            [category]: (interviewQuestions[category] || []).map(q => 
                q.id === questionId ? { ...q, isEditing: true } : q
            )
        };
        updateInterviewQuestions(updated);
    };

    const handleDragEnd = (category: string, event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const questions = interviewQuestions[category] || [];
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over.id);
            const updated = {
                ...interviewQuestions,
                [category]: arrayMove(questions, oldIndex, newIndex)
            };
            updateInterviewQuestions(updated);
        }
    };

    // Sync editor content when aiInterviewSecretPrompt changes from outside
    useEffect(() => {
        if (aiInterviewSecretPromptRef.current && aiInterviewSecretPrompt !== aiInterviewSecretPromptRef.current.innerHTML) {
            aiInterviewSecretPromptRef.current.innerHTML = aiInterviewSecretPrompt || '';
        }
    }, [aiInterviewSecretPrompt]);

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
                                <div style={{ width: "320px" }}>
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
                        </div>
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
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
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#E9EAEB" }}></div>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 6.66667L16.0417 4.375L18.3333 3.33333L16.0417 2.29167L15 0L13.9583 2.29167L11.6667 3.33333L13.9583 4.375L15 6.66667Z" fill="url(#paint0_linear_interview_secret)"/>
                                            <path d="M15 11.6667L13.9583 13.9583L11.6667 15L13.9583 16.0417L15 18.3333L16.0417 16.0417L18.3333 15L16.0417 13.9583L15 11.6667Z" fill="url(#paint1_linear_interview_secret)"/>
                                            <path d="M8.75 7.08333L6.66667 2.5L4.58333 7.08333L0 9.16667L4.58333 11.25L6.66667 15.8333L8.75 11.25L13.3333 9.16667L8.75 7.08333ZM7.49167 9.99167L6.66667 11.8083L5.84167 9.99167L4.025 9.16667L5.84167 8.34167L6.66667 6.525L7.49167 8.34167L9.30833 9.16667L7.49167 9.99167Z" fill="url(#paint2_linear_interview_secret)"/>
                                            <defs>
                                                <linearGradient id="paint0_linear_interview_secret" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_interview_secret" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                                <linearGradient id="paint2_linear_interview_secret" x1="-0.000285505" y1="18.3332" x2="18.3331" y2="-0.000223217" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FCCEC0"/>
                                                    <stop offset="0.33" stopColor="#EBACC9"/>
                                                    <stop offset="0.66" stopColor="#CEB6DA"/>
                                                    <stop offset="1" stopColor="#9FCAED"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span className={cardStyles.sectionTitle}>
                                        AI Interview Secret Prompt <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
                                    </span>
                                    <div ref={iconRef} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={() => setShowTooltip(!showTooltip)}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_interview_secret)">
                                                <path d="M6.05998 6.00001C6.21672 5.55446 6.52608 5.17875 6.93328 4.93943C7.34048 4.70012 7.81924 4.61264 8.28476 4.69248C8.75028 4.77233 9.17252 5.01436 9.4767 5.3757C9.78087 5.73703 9.94735 6.19436 9.94665 6.66668C9.94665 8.00001 7.94665 8.66668 7.94665 8.66668M7.99998 11.3333H8.00665M14.6666 8.00001C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8.00001C1.33331 4.31811 4.31808 1.33334 7.99998 1.33334C11.6819 1.33334 14.6666 4.31811 14.6666 8.00001Z" stroke="#717680" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_interview_secret">
                                                    <rect width="16" height="16" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        {showTooltip && (
                                            <div ref={tooltipRef} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '433px', height: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0px', boxShadow: '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03)', borderRadius: '8px', zIndex: 1000, background: 'transparent' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 12px', width: '433px', height: '52px', background: '#181D27', borderRadius: '8px', flex: 'none', order: 0, alignSelf: 'stretch', flexGrow: 0 }}>
                                                    <div style={{ width: '409px', height: '36px', fontFamily: "'Satoshi'", fontStyle: 'normal', fontWeight: 700, fontSize: '12px', lineHeight: '18px', textAlign: 'center', color: '#FFFFFF', flex: 'none', order: 0, flexGrow: 0 }}>
                                                        These prompts remain hidden from candidates and the public job portal. Additionally, only Admins and the Job Owner can view the secret prompt.
                                                    </div>
                                                </div>
                                                <div style={{ position: 'absolute', width: '12px', height: '12px', left: 'calc(50% - 12px/2 - 2.49px)', bottom: '5px', background: '#181D27', borderRadius: '1px', transform: 'rotate(45deg)', flex: 'none', order: 1, flexGrow: 0 }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className={cardStyles.sectionDescription}>
                                    Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description.
                                </p>
                            </div>
                            <div
                                ref={aiInterviewSecretPromptRef}
                                contentEditable={true}
                                className={`form-control rich-text-editor ${preScreeningStyles.cvSecretPromptInput}`}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    overflowY: "auto",
                                    padding: "12px",
                                    lineHeight: "1.5",
                                    position: "relative",
                                    minHeight: "180px"
                                }}
                                onInput={() => {
                                    if (aiInterviewSecretPromptRef.current) {
                                        setAiInterviewSecretPrompt(aiInterviewSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                onBlur={() => {
                                    if (aiInterviewSecretPromptRef.current) {
                                        setAiInterviewSecretPrompt(aiInterviewSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData('text/plain');
                                    document.execCommand('insertText', false, text);
                                    if (aiInterviewSecretPromptRef.current) {
                                        setAiInterviewSecretPrompt(aiInterviewSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                data-placeholder="Enter a secret prompt (e.g. Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
                            ></div>
                        </div>
                    </div>
                </div>

                <div className={cardStyles.careerCard}>
                    <div className={cardStyles.careerCardHeader} style={{ justifyContent: 'space-between', width: '100%' }}>
                        <span className={cardStyles.careerCardTitle} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span>
                                2. AI Interview Questions <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
                            </span>
                            <span style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '2px 8px', width: '22px', height: '22px', background: 'var(--Colors-Secondary_Colors-Blue-gray-50, #F8F9FC)', border: '1px solid var(--Colors-Secondary_Colors-Blue-gray-200, #D5D9EB)', borderRadius: '16px', flex: 'none', order: 0, flexGrow: 0, marginLeft: '8px', fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'center', color: 'var(--Colors-Secondary_Colors-Blue-gray-700, #363F72)' }}>
                                {Object.values(interviewQuestions).flat().length}
                            </span>
                        </span>
                        <button className={cardStyles.addCustomButton} onClick={() => {}}>
                            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 6.66667L16.0417 4.375L18.3333 3.33333L16.0417 2.29167L15 0L13.9583 2.29167L11.6667 3.33333L13.9583 4.375L15 6.66667Z" fill="white"/>
                                    <path d="M15 11.6667L13.9583 13.9583L11.6667 15L13.9583 16.0417L15 18.3333L16.0417 16.0417L18.3333 15L16.0417 13.9583L15 11.6667Z" fill="white"/>
                                    <path d="M8.75 7.08333L6.66667 2.5L4.58333 7.08333L0 9.16667L4.58333 11.25L6.66667 15.8333L8.75 11.25L13.3333 9.16667L8.75 7.08333ZM7.49167 9.99167L6.66667 11.8083L5.84167 9.99167L4.025 9.16667L5.84167 8.34167L6.66667 6.525L7.49167 8.34167L9.30833 9.16667L7.49167 9.99167Z" fill="white"/>
                                </svg>
                            </div>
                            <span style={{ color: 'white', fontFamily: 'Satoshi', fontSize: '14px', fontWeight: 500 }}>Generate all questions</span>
                        </button>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg, 24px)' }}>
                            {fieldErrors.interviewQuestions && (
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "0px", gap: "8px" }}>
                                    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.54164 5.92058V9.25391M9.54164 12.5872H9.54998M8.11664 1.63725L1.05831 13.4206C0.912783 13.6726 0.835782 13.9583 0.834967 14.2493C0.834153 14.5404 0.909552 14.8265 1.05367 15.0794C1.19778 15.3322 1.40558 15.5429 1.6564 15.6905C1.90722 15.838 2.19231 15.9174 2.48331 15.9206H16.6C16.891 15.9174 17.1761 15.838 17.4269 15.6905C17.6777 15.5429 17.8855 15.3322 18.0296 15.0794C18.1737 14.8265 18.2491 14.5404 18.2483 14.2493C18.2475 13.9583 18.1705 13.6726 18.025 13.4206L10.9666 1.63725C10.8181 1.39234 10.6089 1.18985 10.3593 1.04932C10.1097 0.908788 9.82809 0.834961 9.54164 0.834961C9.2552 0.834961 8.97359 0.908788 8.72398 1.04932C8.47438 1.18985 8.2652 1.39234 8.11664 1.63725Z" stroke="#F04438" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span style={{
                                        fontFamily: 'Satoshi',
                                        fontWeight: 500,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        letterSpacing: '0%',
                                        color: 'var(--Text-text-error, #D92D20)'
                                    }}>
                                        {fieldErrors.interviewQuestions}
                                    </span>
                                </div>
                            )}
                            {['CV Validation / Experience', 'Technical', 'Behavioral', 'Analytical', 'Others'].map((category, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md, 16px)' }}>
                                        <span style={{
                                            fontFamily: 'Satoshi',
                                            fontWeight: 700,
                                            fontStyle: 'normal',
                                            fontSize: '16px',
                                            lineHeight: '24px',
                                            letterSpacing: '0%',
                                            color: 'var(--Text-text-primary, #181D27)'
                                        }}>
                                            {category}
                                        </span>
                                        {interviewQuestions[category] && interviewQuestions[category].length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md, 16px)' }}>
                                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(category, e)}>
                                                    <SortableContext items={interviewQuestions[category].map(q => q.id)} strategy={verticalListSortingStrategy}>
                                                        {interviewQuestions[category].map((question) => (
                                                            <SortableInterviewQuestionItem
                                                                key={question.id}
                                                                question={question}
                                                                category={category}
                                                                onDelete={handleDeleteQuestion}
                                                                onUpdate={handleUpdateQuestion}
                                                                onEdit={handleEditQuestion}
                                                                sensors={sensors}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--spacing-sm, 12px)' }}>
                                            <button
                                                className={cardStyles.addCustomButton}
                                                style={{
                                                    height: '36px',
                                                    padding: '8px 14px'
                                                }}
                                                onClick={() => {}}
                                            >
                                                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15 6.66667L16.0417 4.375L18.3333 3.33333L16.0417 2.29167L15 0L13.9583 2.29167L11.6667 3.33333L13.9583 4.375L15 6.66667Z" fill="white"/>
                                                        <path d="M15 11.6667L13.9583 13.9583L11.6667 15L13.9583 16.0417L15 18.3333L16.0417 16.0417L18.3333 15L16.0417 13.9583L15 11.6667Z" fill="white"/>
                                                        <path d="M8.75 7.08333L6.66667 2.5L4.58333 7.08333L0 9.16667L4.58333 11.25L6.66667 15.8333L8.75 11.25L13.3333 9.16667L8.75 7.08333ZM7.49167 9.99167L6.66667 11.8083L5.84167 9.99167L4.025 9.16667L5.84167 8.34167L6.66667 6.525L7.49167 8.34167L9.30833 9.16667L7.49167 9.99167Z" fill="white"/>
                                                    </svg>
                                                </div>
                                                <span style={{
                                                    fontFamily: 'Satoshi',
                                                    fontWeight: 700,
                                                    fontStyle: 'normal',
                                                    fontSize: '14px',
                                                    lineHeight: '20px',
                                                    letterSpacing: '0%',
                                                    color: 'var(--Button-text-primary, #FFFFFF)'
                                                }}>
                                                    Generate questions
                                                </span>
                                            </button>
                                            <button
                                                className={preScreeningStyles.addQuestionButton}
                                                style={{
                                                    height: '36px',
                                                    padding: '8px 14px'
                                                }}
                                                onClick={() => handleAddQuestion(category)}
                                            >
                                                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.16829 5.83502V12.5017M5.83496 9.16836H12.5016M17.5016 9.16836C17.5016 13.7707 13.7707 17.5017 9.16829 17.5017C4.56592 17.5017 0.834961 13.7707 0.834961 9.16836C0.834961 4.56598 4.56592 0.835022 9.16829 0.835022C13.7707 0.835022 17.5016 4.56598 17.5016 9.16836Z" stroke="#535862" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span style={{
                                                    fontFamily: 'Satoshi',
                                                    fontWeight: 700,
                                                    fontStyle: 'normal',
                                                    fontSize: '14px',
                                                    lineHeight: '20px',
                                                    letterSpacing: '0%',
                                                    color: 'var(--Button-text-secondary, #414651)'
                                                }}>
                                                    Manually add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    {index < 4 && (
                                        <div style={{ width: '100%', height: '1px', backgroundColor: '#E9EAEB', marginTop: 'var(--spacing-lg, 24px)' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
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

