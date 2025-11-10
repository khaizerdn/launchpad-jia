"use client"

import { useState, useRef, useEffect, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CareerDropdown from "@/lib/components/Dropdown/CareerDropdown";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import styles from "@/lib/styles/components/careerForm.module.scss";
import tipsStyles from "@/lib/styles/components/careerTips.module.scss";
import cardStyles from "@/lib/styles/components/careerContentCards.module.scss";
import preScreeningStyles from "@/lib/styles/components/careerPreScreeningQuestions.module.scss";
import LayeredCard from "@/lib/components/LayeredCard";

interface CareerContentCVReviewProps {
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    screeningSettingList: any[];
    cvSecretPrompt: string;
    setCvSecretPrompt: (value: string) => void;
    preScreeningQuestions?: any[];
    setPreScreeningQuestions?: (questions: any[]) => void;
    questionOptions?: {[questionId: string]: {id: string, value: string, number: number}[]};
    setQuestionOptions?: (options: {[questionId: string]: {id: string, value: string, number: number}[]}) => void;
    questionSalaryRanges?: {[questionId: string]: {minimum: string, maximum: string}};
    setQuestionSalaryRanges?: (ranges: {[questionId: string]: {minimum: string, maximum: string}}) => void;
}

interface SortableQuestionItemProps {
    question: { id: string; title: string; description: string; type?: string };
    onDelete: (id: string) => void;
    options: { id: string; value: string; number: number }[];
    onAddOption: (questionId: string) => void;
    onRemoveOption: (questionId: string, optionId: string) => void;
    onUpdateOption: (questionId: string, optionId: string, value: string) => void;
    onDragOptionEnd: (questionId: string, activeId: string, overId: string | null) => void;
    onUpdateType: (questionId: string, type: string) => void;
    onUpdateDescription: (questionId: string, description: string) => void;
    sensors: any;
    salaryRanges: {[questionId: string]: {minimum: string, maximum: string}};
    onUpdateSalaryRange: (questionId: string, field: 'minimum' | 'maximum', value: string) => void;
}

interface SortableOptionItemProps {
    option: { id: string; value: string; number: number };
    questionId: string;
    onRemove: (questionId: string, optionId: string) => void;
    onUpdate: (questionId: string, optionId: string, value: string) => void;
}

function SortableOptionItem({ option, questionId, onRemove, onUpdate }: SortableOptionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: option.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={preScreeningStyles.optionItem}
        >
            <div className={preScreeningStyles.optionDragHandle} {...attributes} {...listeners}>
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33333 11.6667C3.33333 12.5833 2.58333 13.3333 1.66667 13.3333C0.75 13.3333 0 12.5833 0 11.6667C0 10.75 0.75 10 1.66667 10C2.58333 10 3.33333 10.75 3.33333 11.6667ZM1.66667 5C0.75 5 0 5.75 0 6.66667C0 7.58333 0.75 8.33333 1.66667 8.33333C2.58333 8.33333 3.33333 7.58333 3.33333 6.66667C3.33333 5.75 2.58333 5 1.66667 5ZM1.66667 0C0.75 0 0 0.75 0 1.66667C0 2.58333 0.75 3.33333 1.66667 3.33333C2.58333 3.33333 3.33333 2.58333 3.33333 1.66667C3.33333 0.75 2.58333 0 1.66667 0ZM6.66667 3.33333C7.58333 3.33333 8.33333 2.58333 8.33333 1.66667C8.33333 0.75 7.58333 0 6.66667 0C5.75 0 5 0.75 5 1.66667C5 2.58333 5.75 3.33333 6.66667 3.33333ZM6.66667 5C5.75 5 5 5.75 5 6.66667C5 7.58333 5.75 8.33333 6.66667 8.33333C7.58333 8.33333 8.33333 7.58333 8.33333 6.66667C8.33333 5.75 7.58333 5 6.66667 5ZM6.66667 10C5.75 10 5 10.75 5 11.6667C5 12.5833 5.75 13.3333 6.66667 13.3333C7.58333 13.3333 8.33333 12.5833 8.33333 11.6667C8.33333 10.75 7.58333 10 6.66667 10Z" fill="#A4A7AE"/>
                </svg>
            </div>
            <div className={preScreeningStyles.optionLeftContainer}>
                <div className={preScreeningStyles.optionNumberContainer}>
                    <span className={preScreeningStyles.optionNumber}>{option.number}</span>
                </div>
                <input
                    type="text"
                    className={preScreeningStyles.optionInput}
                    value={option.value}
                    onChange={(e) => onUpdate(questionId, option.id, e.target.value)}
                    placeholder="Enter option"
                />
            </div>
            <button 
                className={preScreeningStyles.optionRemoveButton}
                onClick={() => onRemove(questionId, option.id)}
            >
                <div className={preScreeningStyles.optionRemoveButtonInner}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#535862" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </button>
        </div>
    );
}

function SortableQuestionItem({ question, onDelete, options, onAddOption, onRemoveOption, onUpdateOption, onDragOptionEnd, onUpdateType, onUpdateDescription, sensors, salaryRanges, onUpdateSalaryRange }: SortableQuestionItemProps) {
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

    const questionTypes = [
        { 
            name: 'Short Answer', 
            value: 'Short Answer',
            iconComponent: (
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1683 15.835V14.1683C14.1683 13.2842 13.8171 12.4364 13.192 11.8113C12.5669 11.1862 11.719 10.835 10.835 10.835H4.16829C3.28424 10.835 2.43639 11.1862 1.81127 11.8113C1.18615 12.4364 0.834961 13.2842 0.834961 14.1683V15.835M10.835 4.16829C10.835 6.00924 9.34258 7.50163 7.50163 7.50163C5.66068 7.50163 4.16829 6.00924 4.16829 4.16829C4.16829 2.32735 5.66068 0.834961 7.50163 0.834961C9.34258 0.834961 10.835 2.32735 10.835 4.16829Z" stroke="#717680" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            name: 'Long Answer', 
            value: 'Long Answer',
            iconComponent: (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33333 10H0V11.6667H8.33333V10ZM13.3333 3.33333H0V5H13.3333V3.33333ZM0 8.33333H13.3333V6.66667H0V8.33333ZM0 0V1.66667H13.3333V0H0Z" fill="#717680"/>
                </svg>
            )
        },
        { 
            name: 'Dropdown', 
            value: 'Dropdown',
            iconComponent: (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8.5" cy="8.5" r="7.5" stroke="#717680" strokeWidth="1.5"/>
                    <path d="M6.5 7.5L8.5 9.5L10.5 7.5" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            name: 'Checkboxes', 
            value: 'Checkboxes',
            iconComponent: (
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1683 15.835V14.1683C14.1683 13.2842 13.8171 12.4364 13.192 11.8113C12.5669 11.1862 11.719 10.835 10.835 10.835H4.16829C3.28424 10.835 2.43639 11.1862 1.81127 11.8113C1.18615 12.4364 0.834961 13.2842 0.834961 14.1683V15.835M10.835 4.16829C10.835 6.00924 9.34258 7.50163 7.50163 7.50163C5.66068 7.50163 4.16829 6.00924 4.16829 4.16829C4.16829 2.32735 5.66068 0.834961 7.50163 0.834961C9.34258 0.834961 10.835 2.32735 10.835 4.16829Z" stroke="#717680" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            name: 'Range', 
            value: 'Range',
            iconComponent: (
                <svg width="13" height="5" viewBox="0 0 13 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5H1.25V1.25H0V0H2.5V5ZM7.91667 3.75H5.41667V2.91667H7.08333C7.54167 2.91667 7.91667 2.54167 7.91667 2.08333V0.833333C7.91667 0.375 7.54167 0 7.08333 0H4.16667V1.25H6.66667V2.08333H5C4.54167 2.08333 4.16667 2.45833 4.16667 2.91667V5H7.91667V3.75ZM12.9167 4.16667V0.833333C12.9167 0.375 12.5417 0 12.0833 0H9.16667V1.25H11.6667V2.08333H10V2.91667H11.6667V3.75H9.16667V5H12.0833C12.5417 5 12.9167 4.625 12.9167 4.16667Z" fill="#717680"/>
                </svg>
            )
        },
    ];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={preScreeningStyles.activeQuestionContainer}
        >
            <div className={preScreeningStyles.dragHandleWrapper} {...attributes} {...listeners}>
                <div className={preScreeningStyles.dragHandle}>
                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33333 11.6667C3.33333 12.5833 2.58333 13.3333 1.66667 13.3333C0.75 13.3333 0 12.5833 0 11.6667C0 10.75 0.75 10 1.66667 10C2.58333 10 3.33333 10.75 3.33333 11.6667ZM1.66667 5C0.75 5 0 5.75 0 6.66667C0 7.58333 0.75 8.33333 1.66667 8.33333C2.58333 8.33333 3.33333 7.58333 3.33333 6.66667C3.33333 5.75 2.58333 5 1.66667 5ZM1.66667 0C0.75 0 0 0.75 0 1.66667C0 2.58333 0.75 3.33333 1.66667 3.33333C2.58333 3.33333 3.33333 2.58333 3.33333 1.66667C3.33333 0.75 2.58333 0 1.66667 0ZM6.66667 3.33333C7.58333 3.33333 8.33333 2.58333 8.33333 1.66667C8.33333 0.75 7.58333 0 6.66667 0C5.75 0 5 0.75 5 1.66667C5 2.58333 5.75 3.33333 6.66667 3.33333ZM6.66667 5C5.75 5 5 5.75 5 6.66667C5 7.58333 5.75 8.33333 6.66667 8.33333C7.58333 8.33333 8.33333 7.58333 8.33333 6.66667C8.33333 5.75 7.58333 5 6.66667 5ZM6.66667 10C5.75 10 5 10.75 5 11.6667C5 12.5833 5.75 13.3333 6.66667 13.3333C7.58333 13.3333 8.33333 12.5833 8.33333 11.6667C8.33333 10.75 7.58333 10 6.66667 10Z" fill="#A4A7AE"/>
                    </svg>
                </div>
            </div>
            <div className={preScreeningStyles.questionContainer}>
                <div className={preScreeningStyles.questionHeader}>
                    {!question.title ? (
                        <input
                            type="text"
                            className={preScreeningStyles.questionInput}
                            placeholder="Write your questions..."
                            value={question.description}
                            onChange={(e) => onUpdateDescription(question.id, e.target.value)}
                        />
                    ) : (
                        <span className={preScreeningStyles.questionText}>{question.description}</span>
                    )}
                    <div style={{ width: '232px' }}>
                        <CareerDropdown
                            onSelectSetting={(type) => {
                                onUpdateType(question.id, type);
                            }}
                            screeningSetting={question.type || 'Dropdown'}
                            settingList={questionTypes}
                            placeholder="Select type"
                        />
                    </div>
                </div>
                <div className={preScreeningStyles.questionOptionsContainer}>
                    <div className={preScreeningStyles.optionsListContainer}>
                        {question.type === 'Range' ? (
                            <>
                                <div className={preScreeningStyles.salaryRangeContainer}>
                                    <div className={cardStyles.fieldContainer}>
                                        <span>Minimum</span>
                                        <div style={{ position: "relative" }}>
                                            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>₱</span>
                                            <input
                                                type="number"
                                                className={`form-control ${preScreeningStyles.salaryInput}`}
                                                style={{ paddingLeft: "28px", paddingRight: "35px" }}
                                                placeholder="0"
                                                min={0}
                                                value={salaryRanges[question.id]?.minimum || ''}
                                                onChange={(e) => onUpdateSalaryRange(question.id, 'minimum', e.target.value || '')}
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
                                                className={`form-control ${preScreeningStyles.salaryInput}`}
                                                style={{ paddingLeft: "28px", paddingRight: "35px" }}
                                                placeholder="0"
                                                min={0}
                                                value={salaryRanges[question.id]?.maximum || ''}
                                                onChange={(e) => onUpdateSalaryRange(question.id, 'maximum', e.target.value || '')}
                                                onWheel={(e) => e.currentTarget.blur()}
                                            />
                                            <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "16px", pointerEvents: "none" }}>PHP</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={preScreeningStyles.footerDivider}></div>
                            </>
                        ) : (question.type === 'Dropdown' || question.type === 'Checkboxes' || !question.type) ? (
                            options.length > 0 && (
                                <DndContext 
                                    sensors={sensors} 
                                    collisionDetection={closestCenter} 
                                    onDragEnd={(event) => {
                                        const { active, over } = event;
                                        onDragOptionEnd(question.id, active.id as string, over?.id as string || null);
                                    }}
                                >
                                    <SortableContext items={options.map(opt => opt.id)} strategy={verticalListSortingStrategy}>
                                        {options.map((option) => (
                                            <SortableOptionItem
                                                key={option.id}
                                                option={option}
                                                questionId={question.id}
                                                onRemove={onRemoveOption}
                                                onUpdate={onUpdateOption}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )
                        ) : null}
                        {(question.type === 'Dropdown' || question.type === 'Checkboxes' || !question.type) && (
                            <div className={preScreeningStyles.questionFooterContainer}>
                                <div className={preScreeningStyles.addOptionSection}>
                                    <button 
                                        className={preScreeningStyles.addOptionButton}
                                        onClick={() => onAddOption(question.id)}
                                    >
                                        <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.66829 0.834961V12.5016M0.834961 6.66829H12.5016" stroke="#535862" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <span className={preScreeningStyles.addOptionText}>Add Option</span>
                                    </button>
                                </div>
                                <div className={preScreeningStyles.footerDivider}></div>
                            </div>
                        )}
                        <div className={preScreeningStyles.questionFooterContainer}>
                            <div className={preScreeningStyles.deleteButtonContainer}>
                                <button 
                                    className={preScreeningStyles.deleteQuestionButton}
                                    onClick={() => onDelete(question.id)}
                                >
                                    <img alt="" src="/iconsV3/trashV2.svg" />
                                    <span className={preScreeningStyles.deleteQuestionText}>Delete Question</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CareerContentCVReview({
    screeningSetting,
    setScreeningSetting,
    screeningSettingList,
    cvSecretPrompt,
    setCvSecretPrompt,
    preScreeningQuestions: externalPreScreeningQuestions,
    setPreScreeningQuestions: setExternalPreScreeningQuestions,
    questionOptions: externalQuestionOptions,
    setQuestionOptions: setExternalQuestionOptions,
    questionSalaryRanges: externalQuestionSalaryRanges,
    setQuestionSalaryRanges: setExternalQuestionSalaryRanges,
}: CareerContentCVReviewProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeQuestions, setActiveQuestions] = useState<{id: string, title: string, description: string, type?: string}[]>(externalPreScreeningQuestions || []);
    const [questionOptions, setQuestionOptions] = useState<{[questionId: string]: {id: string, value: string, number: number}[]}>(externalQuestionOptions || {});
    const [questionSalaryRanges, setQuestionSalaryRanges] = useState<{[questionId: string]: {minimum: string, maximum: string}}>(externalQuestionSalaryRanges || {});
    const tooltipRef = useRef<HTMLDivElement>(null);
    const cvSecretPromptRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const isUpdatingFromExternal = useRef(false);

    // Sync editor content when cvSecretPrompt changes from outside
    useEffect(() => {
        if (cvSecretPromptRef.current && cvSecretPrompt !== cvSecretPromptRef.current.innerHTML) {
            cvSecretPromptRef.current.innerHTML = cvSecretPrompt || '';
        }
    }, [cvSecretPrompt]);

    // Sync activeQuestions with external prop
    useEffect(() => {
        if (externalPreScreeningQuestions && externalPreScreeningQuestions !== activeQuestions) {
            isUpdatingFromExternal.current = true;
            setActiveQuestions(externalPreScreeningQuestions);
            setTimeout(() => { isUpdatingFromExternal.current = false; }, 0);
        }
    }, [externalPreScreeningQuestions]);

    // Sync questionOptions with external prop
    useEffect(() => {
        if (externalQuestionOptions && externalQuestionOptions !== questionOptions) {
            isUpdatingFromExternal.current = true;
            setQuestionOptions(externalQuestionOptions);
            setTimeout(() => { isUpdatingFromExternal.current = false; }, 0);
        }
    }, [externalQuestionOptions]);

    // Sync questionSalaryRanges with external prop
    useEffect(() => {
        if (externalQuestionSalaryRanges && externalQuestionSalaryRanges !== questionSalaryRanges) {
            isUpdatingFromExternal.current = true;
            setQuestionSalaryRanges(externalQuestionSalaryRanges);
            setTimeout(() => { isUpdatingFromExternal.current = false; }, 0);
        }
    }, [externalQuestionSalaryRanges]);

    // Notify parent when activeQuestions changes (only if not updating from external)
    useEffect(() => {
        if (setExternalPreScreeningQuestions && !isUpdatingFromExternal.current) {
            setExternalPreScreeningQuestions(activeQuestions);
        }
    }, [activeQuestions, setExternalPreScreeningQuestions]);

    // Notify parent when questionOptions changes (only if not updating from external)
    useEffect(() => {
        if (setExternalQuestionOptions && !isUpdatingFromExternal.current) {
            setExternalQuestionOptions(questionOptions);
        }
    }, [questionOptions, setExternalQuestionOptions]);

    // Notify parent when questionSalaryRanges changes (only if not updating from external)
    useEffect(() => {
        if (setExternalQuestionSalaryRanges && !isUpdatingFromExternal.current) {
            setExternalQuestionSalaryRanges(questionSalaryRanges);
        }
    }, [questionSalaryRanges, setExternalQuestionSalaryRanges]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleAddQuestion = (title: string, description: string) => {
        const newQuestion = {
            id: Date.now().toString(),
            title,
            description,
            type: title === 'Asking Salary' ? 'Range' : undefined
        };
        setActiveQuestions([...activeQuestions, newQuestion]);
        if (title === 'Asking Salary') {
            setQuestionSalaryRanges(prev => ({
                ...prev,
                [newQuestion.id]: { minimum: '', maximum: '' }
            }));
        }
    };

    const handleAddCustomQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            title: '',
            description: '',
            type: undefined
        };
        setActiveQuestions([...activeQuestions, newQuestion]);
    };

    const handleUpdateDescription = (questionId: string, description: string) => {
        setActiveQuestions(prev => prev.map(q => 
            q.id === questionId ? { ...q, description } : q
        ));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setActiveQuestions((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDeleteQuestion = (id: string) => {
        setActiveQuestions((items) => items.filter((item) => item.id !== id));
        setQuestionOptions((prev) => {
            const newOptions = { ...prev };
            delete newOptions[id];
            return newOptions;
        });
    };

    const handleAddOption = (questionId: string) => {
        setQuestionOptions((prev) => {
            const currentOptions = prev[questionId] || [];
            const newOption = {
                id: Date.now().toString(),
                value: '',
                number: currentOptions.length + 1
            };
            return {
                ...prev,
                [questionId]: [...currentOptions, newOption]
            };
        });
    };

    const handleRemoveOption = (questionId: string, optionId: string) => {
        setQuestionOptions((prev) => {
            const currentOptions = prev[questionId] || [];
            const filtered = currentOptions.filter(opt => opt.id !== optionId);
            // Renumber remaining options
            const renumbered = filtered.map((opt, index) => ({
                ...opt,
                number: index + 1
            }));
            return {
                ...prev,
                [questionId]: renumbered
            };
        });
    };

    const handleUpdateOption = (questionId: string, optionId: string, value: string) => {
        setQuestionOptions((prev) => {
            const currentOptions = prev[questionId] || [];
            return {
                ...prev,
                [questionId]: currentOptions.map(opt => 
                    opt.id === optionId ? { ...opt, value } : opt
                )
            };
        });
    };

    const handleDragOptionEnd = (questionId: string, activeId: string, overId: string | null) => {
        if (!overId || activeId === overId) return;

        setQuestionOptions((prev) => {
            const currentOptions = prev[questionId] || [];
            const oldIndex = currentOptions.findIndex((opt) => opt.id === activeId);
            const newIndex = currentOptions.findIndex((opt) => opt.id === overId);

            if (oldIndex === -1 || newIndex === -1) return prev;

            const reordered = arrayMove(currentOptions, oldIndex, newIndex);
            // Renumber all options after reordering
            const renumbered = reordered.map((opt, index) => ({
                ...opt,
                number: index + 1
            }));

            return {
                ...prev,
                [questionId]: renumbered
            };
        });
    };

    const handleUpdateSalaryRange = (questionId: string, field: 'minimum' | 'maximum', value: string) => {
        setQuestionSalaryRanges(prev => ({
            ...prev,
            [questionId]: {
                ...(prev[questionId] || { minimum: '', maximum: '' }),
                [field]: value
            }
        }));
    };

    const handleUpdateType = (questionId: string, type: string) => {
        setActiveQuestions(prev => prev.map(q => 
            q.id === questionId ? { ...q, type } : q
        ));
        // If changing to Range, initialize salary range
        if (type === 'Range') {
            setQuestionSalaryRanges(prev => ({
                ...prev,
                [questionId]: { minimum: '', maximum: '' }
            }));
        }
        // If changing to Dropdown or Checkboxes, initialize empty options array if it doesn't exist
        if (type === 'Dropdown' || type === 'Checkboxes') {
            setQuestionOptions(prev => {
                if (!prev[questionId]) {
                    return {
                        ...prev,
                        [questionId]: []
                    };
                }
                return prev;
            });
        }
        // If changing from Range to something else, clear salary range
        const currentQuestion = activeQuestions.find(q => q.id === questionId);
        if (currentQuestion?.type === 'Range' && type !== 'Range') {
            setQuestionSalaryRanges(prev => {
                const newRanges = { ...prev };
                delete newRanges[questionId];
                return newRanges;
            });
        }
        // If changing from Dropdown/Checkboxes to something else, clear options
        if ((currentQuestion?.type === 'Dropdown' || currentQuestion?.type === 'Checkboxes') && type !== 'Dropdown' && type !== 'Checkboxes') {
            setQuestionOptions(prev => {
                const newOptions = { ...prev };
                delete newOptions[questionId];
                return newOptions;
            });
        }
    };

    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <LayeredCard>
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
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img alt="" src="/iconsV3/sparkle.svg" />
                                    </div>
                                    <span className={cardStyles.sectionTitle}>
                                        CV Secret Prompt <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
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
                                ref={cvSecretPromptRef}
                                contentEditable={true}
                                className={`form-control rich-text-editor ${preScreeningStyles.cvSecretPromptInput}`}
                                style={{ width: "100%", height: "180px", overflowY: "auto", padding: "12px", lineHeight: "1.5", position: "relative", minHeight: "180px" }}
                                onInput={() => {
                                    if (cvSecretPromptRef.current) {
                                        setCvSecretPrompt(cvSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                onBlur={() => {
                                    if (cvSecretPromptRef.current) {
                                        setCvSecretPrompt(cvSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData('text/plain');
                                    document.execCommand('insertText', false, text);
                                    if (cvSecretPromptRef.current) {
                                        setCvSecretPrompt(cvSecretPromptRef.current.innerHTML);
                                    }
                                }}
                                data-placeholder="Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackathons or competitions.)"
                            ></div>
                        </div>
                    </div>
                </LayeredCard>

                <LayeredCard>
                    <div className={cardStyles.careerCardHeader} style={{ justifyContent: 'space-between', width: '100%' }}>
                        <span className={cardStyles.careerCardTitle} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span>
                                2. Pre-Screening Questions <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%', color: 'var(--Text-text-tertiary, #717680)' }}>(optional)</span>
                            </span>
                            <span style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '2px 8px', width: '22px', height: '22px', background: 'var(--Colors-Secondary_Colors-Blue-gray-50, #F8F9FC)', border: '1px solid var(--Colors-Secondary_Colors-Blue-gray-200, #D5D9EB)', borderRadius: '16px', flex: 'none', order: 0, flexGrow: 0, marginLeft: '8px', fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'center', color: 'var(--Colors-Secondary_Colors-Blue-gray-700, #363F72)' }}>
                                {activeQuestions.length}
                            </span>
                        </span>
                        <button className={cardStyles.addCustomButton} onClick={handleAddCustomQuestion}>
                            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img alt="" src="/iconsV3/plusV2.svg" />
                            </div>
                            <span style={{ color: 'white', fontFamily: 'Satoshi', fontSize: '14px', fontWeight: 500 }}>Add Custom</span>
                        </button>
                    </div>
                    <div className={cardStyles.careerCardContent}>
                        {activeQuestions.length > 0 && (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={activeQuestions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                                        {activeQuestions.map((question) => (
                                            <SortableQuestionItem 
                                                key={question.id} 
                                                question={question} 
                                                onDelete={handleDeleteQuestion}
                                                options={questionOptions[question.id] || []}
                                                onAddOption={handleAddOption}
                                                onRemoveOption={handleRemoveOption}
                                                onUpdateOption={handleUpdateOption}
                                                onDragOptionEnd={handleDragOptionEnd}
                                                onUpdateType={handleUpdateType}
                                                onUpdateDescription={handleUpdateDescription}
                                                sensors={sensors}
                                                salaryRanges={questionSalaryRanges}
                                                onUpdateSalaryRange={handleUpdateSalaryRange}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                        {activeQuestions.length === 0 && (
                            <p className={cardStyles.sectionDescription}>
                                No pre-screening questions added yet.
                            </p>
                        )}
                        <div className={cardStyles.reviewDivider}></div>
                        <div className={preScreeningStyles.suggestedQuestionsContainer}>
                            <span className={cardStyles.sectionTitle}>Suggested Pre-screening Questions:</span>
                            <div className={preScreeningStyles.suggestedQuestionItem}>
                                <div className={preScreeningStyles.questionContent}>
                                    <span className={`${preScreeningStyles.questionTitle} ${activeQuestions.some(q => q.title === 'Notice Period') ? preScreeningStyles.disabled : ''}`}>Notice Period</span>
                                    <span className={`${preScreeningStyles.questionDescription} ${activeQuestions.some(q => q.title === 'Notice Period') ? preScreeningStyles.disabled : ''}`}>How long is your notice period?</span>
                                </div>
                                <button 
                                    className={preScreeningStyles.addQuestionButton}
                                    onClick={() => handleAddQuestion('Notice Period', 'How long is your notice period?')}
                                    disabled={activeQuestions.some(q => q.title === 'Notice Period')}
                                >
                                    <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: activeQuestions.some(q => q.title === 'Notice Period') ? 'var(--Button-text-secondary-disabled, #D5D7DA)' : 'var(--Button-text-secondary, #414651)' }}>
                                        {activeQuestions.some(q => q.title === 'Notice Period') ? 'Added' : 'Add'}
                                    </span>
                                </button>
                            </div>
                            <div className={preScreeningStyles.suggestedQuestionItem}>
                                <div className={preScreeningStyles.questionContent}>
                                    <span className={`${preScreeningStyles.questionTitle} ${activeQuestions.some(q => q.title === 'Work Setup') ? preScreeningStyles.disabled : ''}`}>Work Setup</span>
                                    <span className={`${preScreeningStyles.questionDescription} ${activeQuestions.some(q => q.title === 'Work Setup') ? preScreeningStyles.disabled : ''}`}>Are you willing to report to the office when required?</span>
                                </div>
                                <button 
                                    className={preScreeningStyles.addQuestionButton}
                                    onClick={() => handleAddQuestion('Work Setup', 'Are you willing to report to the office when required?')}
                                    disabled={activeQuestions.some(q => q.title === 'Work Setup')}
                                >
                                    <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: activeQuestions.some(q => q.title === 'Work Setup') ? 'var(--Button-text-secondary-disabled, #D5D7DA)' : 'var(--Button-text-secondary, #414651)' }}>
                                        {activeQuestions.some(q => q.title === 'Work Setup') ? 'Added' : 'Add'}
                                    </span>
                                </button>
                            </div>
                            <div className={preScreeningStyles.suggestedQuestionItem}>
                                <div className={preScreeningStyles.questionContent}>
                                    <span className={`${preScreeningStyles.questionTitle} ${activeQuestions.some(q => q.title === 'Asking Salary') ? preScreeningStyles.disabled : ''}`}>Asking Salary</span>
                                    <span className={`${preScreeningStyles.questionDescription} ${activeQuestions.some(q => q.title === 'Asking Salary') ? preScreeningStyles.disabled : ''}`}>How much is your expected monthly salary?</span>
                                </div>
                                <button 
                                    className={preScreeningStyles.addQuestionButton}
                                    onClick={() => handleAddQuestion('Asking Salary', 'How much is your expected monthly salary?')}
                                    disabled={activeQuestions.some(q => q.title === 'Asking Salary')}
                                >
                                    <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', color: activeQuestions.some(q => q.title === 'Asking Salary') ? 'var(--Button-text-secondary-disabled, #D5D7DA)' : 'var(--Button-text-secondary, #414651)' }}>
                                        {activeQuestions.some(q => q.title === 'Asking Salary') ? 'Added' : 'Add'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </LayeredCard>
            </div>

            <div className={styles.rightContainer}>
                <div className="layered-card-middle">
                    <div className={cardStyles.careerCardHeader}>
                        <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img alt="" src="/iconsV3/bulb.svg" />
                        </div>
                        <span className={cardStyles.careerCardTitle}>Tips</span>
                    </div>
                    <div className={cardStyles.careerCardContent}>
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

