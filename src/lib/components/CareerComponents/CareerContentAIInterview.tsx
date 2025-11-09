"use client"

import { useState, useRef, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CareerDropdown from "@/lib/components/Dropdown/CareerDropdown";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import preScreeningStyles from "@/lib/styles/components/careerPreScreeningQuestions.module.scss";

interface CareerContentAIInterviewProps {
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
            style={{ ...style, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 'var(--padding-sm, 8px)', gap: 'var(--spacing-md, 16px)', border: '1px solid var(--Border-primary, #E9EAEB)', borderRadius: '12px', background: 'transparent', width: '100%' }}
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
                        style={{ height: '40px', border: '1px solid var(--Input-border-primary, #E9EAEB)', borderRadius: '8px', boxShadow: '0px 1px 2px 0px #0A0D120D', padding: '10px 14px', background: 'var(--Input-bg-primary, #FFFFFF)', color: 'var(--Input-text-primary, #181D27)' }}
                    />
                ) : (
                    <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-secondary, #414651)', flex: 1 }}>
                        {question.text}
                    </span>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-sm, 8px)' }}>
                <button
                    className={preScreeningStyles.addQuestionButton}
                    style={{ height: '36px', padding: '8px 14px' }}
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
                        <img alt="" src="/iconsV3/edit.svg" />
                    </div>
                    <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: 'var(--Button-text-secondary, #414651)' }}>
                        {question.isEditing ? 'Save' : 'Edit'}
                    </span>
                </button>
                <button
                    className={preScreeningStyles.deleteQuestionButton}
                    onClick={() => onDelete(category, question.id)}
                    style={{ width: '36px', height: '36px', padding: '0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <img alt="" src="/iconsV3/trashV2.svg" />
                </button>
            </div>
        </div>
    );
}

export default function CareerContentAIInterview({
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
}: CareerContentAIInterviewProps) {
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
                                    <CareerDropdown
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
                        <div className={cardStyles.reviewDivider}></div>
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
                        <div className={cardStyles.reviewDivider}></div>
                        <div className={cardStyles.sectionWrapper}>
                            <div className={cardStyles.sectionTitleDescriptionWrapper}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img alt="" src="/iconsV3/sparkle.svg" />
                                    </div>
                                    <span className={cardStyles.sectionTitle}>
                                        AI Interview Secret Prompt <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
                                    </span>
                                    <div ref={iconRef} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={() => setShowTooltip(!showTooltip)}>
                                        <img alt="" src="/iconsV3/question.svg" />
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
                                style={{ width: "100%", height: "180px", overflowY: "auto", padding: "12px", lineHeight: "1.5", position: "relative", minHeight: "180px" }}
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
                                <img alt="" src="/iconsV3/sparkleV2.svg" />
                            </div>
                            <span style={{ color: 'white', fontFamily: 'Satoshi', fontSize: '14px', fontWeight: 500 }}>Generate all questions</span>
                        </button>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg, 24px)' }}>
                            {fieldErrors.interviewQuestions && (
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "0px", gap: "8px" }}>
                                    <img alt="" src="/iconsV3/alertV3.svg" />
                                    <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: 'var(--Text-text-error, #D92D20)' }}>
                                        {fieldErrors.interviewQuestions}
                                    </span>
                                </div>
                            )}
                            {['CV Validation / Experience', 'Technical', 'Behavioral', 'Analytical', 'Others'].map((category, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md, 16px)' }}>
                                        <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-primary, #181D27)' }}>
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
                                                style={{ height: '36px', padding: '8px 14px' }}
                                                onClick={() => {}}
                                            >
                                                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img alt="" src="/iconsV3/sparkleV2.svg" />
                                                </div>
                                                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: 'var(--Button-text-primary, #FFFFFF)' }}>
                                                    Generate questions
                                                </span>
                                            </button>
                                            <button
                                                className={preScreeningStyles.addQuestionButton}
                                                style={{ height: '36px', padding: '8px 14px' }}
                                                onClick={() => handleAddQuestion(category)}
                                            >
                                                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img alt="" src="/iconsV3/plus.svg" />
                                                </div>
                                                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: 'var(--Button-text-secondary, #414651)' }}>
                                                    Manually add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    {index < 4 && (
                                        <div className={cardStyles.reviewDivider} style={{ marginTop: 'var(--spacing-lg, 24px)' }}></div>
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
                        <img alt="" src="/iconsV3/bulb.svg" />
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

