"use client"

import { useState, useRef, useEffect } from "react";
import styles from "@/lib/styles/components/memberDropdown.module.scss";

interface Member {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatarColor?: string;
}

interface MemberDropdownProps {
    onSelectMember: (member: Member) => void;
    existingMemberIds?: number[];
    availableMembers?: Member[];
}

const defaultMembers: Member[] = [
    { id: 1, name: "Aliah Lane", email: "aliah@whitecloak.com", avatarColor: "#D7C0DD" },
    { id: 2, name: "Lana Steiner", email: "lana@whitecloak.com", avatarColor: "#D4AFBD" },
    { id: 3, name: "Noah Pierre", email: "noah@whitecloak.com", avatarColor: "#D4AFBD" },
    { id: 4, name: "Candice Wu", email: "candice@whitecloak.com", avatarColor: "#A2A8CD" },
    { id: 5, name: "Alisa Hester", email: "alisa@whitecloak.com", avatarColor: "#D8C7B6" },
    { id: 6, name: "Rosalee Melvin", email: "rosalee@whitecloak.com", avatarColor: "#D8C7B6" },
    { id: 7, name: "Kelly Williams", email: "kelly@whitecloak.com", avatarColor: "#D8C7B6" },
];

export default function MemberDropdown({ onSelectMember, existingMemberIds = [], availableMembers = defaultMembers }: MemberDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredMembers = availableMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const notAlreadyAdded = !existingMemberIds.includes(member.id);
        return matchesSearch && notAlreadyAdded;
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectMember = (member: Member) => {
        onSelectMember(member);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div className={styles.memberDropdownContainer} ref={dropdownRef}>
            <div className="dropdown w-100">
                <button
                    className="dropdown-btn fade-in-bottom"
                    style={{ width: "100%", textTransform: "capitalize" }}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>
                        <i className="la la-user-plus"></i>{" "}
                        Add member
                    </span>
                    <i className="la la-angle-down ml-10"></i>
                </button>
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                        <div className={styles.searchInputContainer}>
                            <i className="la la-search" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#717680", zIndex: 1, pointerEvents: "none" }}></i>
                            <input
                                type="text"
                                className="form-control"
                                style={{ paddingLeft: "36px" }}
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className={styles.divider}></div>
                    </div>

                    <div className={styles.menuItems}>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className={styles.menuItem}
                                    onClick={() => handleSelectMember(member)}
                                >
                                    <div className={styles.menuItemContent}>
                                        <div 
                                            className={styles.memberAvatarSmall}
                                            style={{ 
                                                backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                                                backgroundColor: member.avatarColor || '#D7C0DD'
                                            }}
                                        ></div>
                                        <span className={styles.memberNameText}>{member.name}</span>
                                        <span className={styles.memberEmailText}>{member.email}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <span>No members found</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

