"use client";

import { useState, useEffect, useRef } from "react";

interface CareerDropdownOption {
  id?: string;
  value?: string;
  name?: string;
  number?: number;
  icon?: string;
  iconComponent?: React.ReactNode;
  description?: string;
}

interface CareerDropdownProps {
  // For UploadCV_PreScreeningQuestions usage
  questionId?: string;
  options?: CareerDropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  // For CareerContentCareerDetails usage (compatible with CustomDropdown)
  onSelectSetting?: (value: string) => void;
  screeningSetting?: string;
  settingList?: CareerDropdownOption[];
  placeholder?: string;
  allowEmpty?: boolean;
  error?: string;
}

export default function CareerDropdown({
  questionId,
  options,
  value,
  onChange,
  onSelectSetting,
  screeningSetting,
  settingList,
  placeholder,
  allowEmpty = false,
  error,
}: CareerDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Support both interfaces: UploadCV_PreScreeningQuestions (options/value/onChange) and CareerContentCareerDetails (settingList/screeningSetting/onSelectSetting)
  const dropdownOptions = options || settingList || [];
  const selectedValue = value || screeningSetting || "";
  const handleChange = onChange || onSelectSetting || (() => {});

  // Automatically calculate dropdown position based on available space
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const calculatePosition = () => {
        if (buttonRef.current && menuRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          // Estimate menu height (use actual if available, otherwise estimate)
          const menuHeight = menuRef.current.offsetHeight || 
            (dropdownOptions.some(s => s.description) 
              ? 300 
              : Math.min(dropdownOptions.length * 44, 200));
          
          // Add buffer (50px) to ensure menu doesn't touch viewport edge
          const requiredSpace = menuHeight + 50;
          
          // Open upward if not enough space below but more space above
          if (spaceBelow < requiredSpace && spaceAbove > spaceBelow) {
            setOpenUpward(true);
          } else {
            setOpenUpward(false);
          }
        }
      };
      
      // Calculate immediately and after a short delay to account for rendering
      calculatePosition();
      const timeoutId = setTimeout(calculatePosition, 0);
      
      // Recalculate on scroll/resize
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("scroll", calculatePosition, true);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [dropdownOpen, dropdownOptions.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Maintain error border even when focused or dropdown is open
  useEffect(() => {
    if (buttonRef.current) {
      if (error) {
        buttonRef.current.style.border = "1px solid var(--Input-border-destructive, #FDA29B)";
        buttonRef.current.style.borderColor = "var(--Input-border-destructive, #FDA29B)";
        buttonRef.current.style.borderWidth = "1px";
      } else {
        // Reset to default when no error
        buttonRef.current.style.border = "1px solid var(--Button-border-primary, #D5D7DA)";
        buttonRef.current.style.borderColor = undefined;
        buttonRef.current.style.borderWidth = "1px";
      }
    }
  }, [error, dropdownOpen]);

  // Find selected option - support both 'value' and 'name' properties
  const selectedOption = dropdownOptions.find(
    opt => (opt.value || opt.name) === selectedValue
  );
  const displayValue = selectedOption 
    ? (selectedOption.value || selectedOption.name || "") 
    : (placeholder || "Select an option");

  return (
    <div className="dropdown w-100" ref={dropdownRef} style={{ position: "relative", marginTop: "0" }}>
      <button
        ref={buttonRef}
        disabled={!allowEmpty && dropdownOptions.length === 0}
        className={`form-control dropdown-btn fade-in-bottom ${error ? 'has-error' : ''}`}
        style={{ 
          width: "100%",
          height: "44px",
          gap: "8px",
          borderRadius: "8px",
          paddingTop: "10px",
          paddingRight: "14px",
          paddingBottom: "10px",
          paddingLeft: "14px",
          borderWidth: "1px",
          background: "var(--Input-bg-primary, #FFFFFF)",
          border: error ? "1px solid var(--Input-border-destructive, #FDA29B)" : "1px solid var(--Button-border-primary, #D5D7DA)",
          borderColor: error ? "var(--Input-border-destructive, #FDA29B)" : undefined,
          boxShadow: "0px 1px 2px 0px #0A0D120D",
          marginTop: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "background 0.3s ease-out, color 0.3s ease-out",
          textTransform: "capitalize",
          outline: "none",
        }}
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        onFocus={(e) => {
          e.currentTarget.style.outline = "none";
          if (error) {
            e.currentTarget.style.border = "1px solid var(--Input-border-destructive, #FDA29B)";
            e.currentTarget.style.borderColor = "var(--Input-border-destructive, #FDA29B)";
            e.currentTarget.style.borderWidth = "1px";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
          if (error) {
            e.currentTarget.style.border = "1px solid var(--Input-border-destructive, #FDA29B)";
            e.currentTarget.style.borderColor = "var(--Input-border-destructive, #FDA29B)";
            e.currentTarget.style.borderWidth = "1px";
          }
        }}
      >
        <span style={{
          fontFamily: "inherit",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0%",
          color: "var(--Input-text-placeholder-or-disabled, #717680)",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
          minWidth: 0
        }}>
          {selectedOption?.iconComponent ? (
            <div style={{ width: "20px", height: "20px", marginRight: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {selectedOption.iconComponent}
            </div>
          ) : selectedOption?.icon ? (
            <i className={selectedOption.icon} style={{ marginRight: "5px", flexShrink: 0 }}></i>
          ) : null}
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {displayValue?.replace("_", " ")}
          </span>
        </span>
        <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
          <img alt="" src="/iconsV3/arrowDown.svg" style={{ margin: 0 }} />
        </div>
      </button>
      {dropdownOpen && (
        <div
          ref={menuRef}
          className="dropdown-menu w-100 mt-1 show"
          style={{
            position: "absolute",
            borderRadius: "8px",
            borderWidth: "1px",
            background: "var(--Surface-white, #FFFFFF)",
            border: "1px solid var(--Colors-Primary_Colors-Neutrals-100, #F5F5F5)",
            boxShadow: "0px 4px 6px -2px #0A0D1208, 0px 12px 16px -4px #0A0D1214",
            maxHeight: dropdownOptions.some(s => s.description) ? "none" : 200,
            overflowY: dropdownOptions.some(s => s.description) ? "visible" : "auto",
            top: openUpward ? "auto" : "100%",
            bottom: openUpward ? "100%" : "auto",
            left: 0,
            right: 0,
            zIndex: 1000,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0",
            opacity: 0,
            animation: "dissolve 0.3s ease-out forwards",
            WebkitAnimation: "dissolve 0.3s ease-out forwards",
            marginTop: openUpward ? "0" : "4px",
            marginBottom: openUpward ? "4px" : "0",
          }}
        >
          {dropdownOptions.map((option, index) => {
            const optionValue = option.value || option.name || "";
            const isSelected = selectedValue === optionValue;
            const hasDescription = option.description;
            
            return (
              <button
                key={option.id || index}
                className="dropdown-item"
                style={{
                  width: "100%",
                  borderRadius: hasDescription ? "12px" : "0",
                  overflow: "hidden",
                  paddingTop: "10px",
                  paddingRight: "14px",
                  paddingBottom: "10px",
                  paddingLeft: "14px",
                  height: hasDescription ? "auto" : "44px",
                  minHeight: hasDescription ? "auto" : "44px",
                  color: "var(--Input-text-primary, #181D27)",
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? "#EEF4FF" : "transparent",
                  display: "flex",
                  flexDirection: hasDescription ? "column" : "row",
                  justifyContent: hasDescription ? "flex-start" : "space-between",
                  alignItems: hasDescription ? "flex-start" : "center",
                  gap: hasDescription ? "4px" : "8px",
                  whiteSpace: "normal",
                  textTransform: "capitalize",
                  border: "none",
                  borderBottom: "none",
                  marginTop: "0",
                  marginBottom: hasDescription ? "0" : "0",
                  transition: "background 0.2s, color 0.2s",
                  fontFamily: "inherit",
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "0%",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "#f6f6f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                onFocus={(e) => e.currentTarget.style.outline = "none"}
                onBlur={(e) => e.currentTarget.style.outline = "none"}
                onClick={() => {
                  handleChange(optionValue);
                  setDropdownOpen(false);
                }}
              >
                {hasDescription ? (
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: "20px" }}>
                      <span style={{ fontFamily: "Satoshi", fontStyle: "normal", fontWeight: 700, fontSize: "14px", lineHeight: "20px", color: isSelected ? "#181D27" : "#414651" }}>
                        {option.iconComponent ? (
                          <div style={{ width: "20px", height: "20px", marginRight: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {option.iconComponent}
                          </div>
                        ) : option.icon ? (
                          <i className={option.icon} style={{ marginRight: "5px" }}></i>
                        ) : null}
                        {optionValue?.replace("_", " ")}
                      </span>
                      {isSelected && (
                        <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 0 }}>
                            <defs>
                              <linearGradient id={`paint0_linear_${option.id || index}`} x1="0.833496" y1="0.833374" x2="14.1668" y2="0.833374" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9FCAED"/>
                                <stop offset="0.34" stopColor="#CEB6DA"/>
                                <stop offset="0.67" stopColor="#EBACC9"/>
                                <stop offset="1" stopColor="#FCCEC0"/>
                              </linearGradient>
                            </defs>
                            <path d="M14.1668 0.833374L5.00016 10L0.833496 5.83337" stroke={`url(#paint0_linear_${option.id || index})`} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    {option.description && (
                      <span style={{ fontFamily: "Satoshi", fontStyle: "normal", fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#717680", width: "100%" }}>
                        {option.description}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                      {option.iconComponent ? (
                        <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {option.iconComponent}
                        </div>
                      ) : option.icon ? (
                        <i className={option.icon}></i>
                      ) : null} {optionValue?.replace("_", " ")}
                    </div>
                    {isSelected && (
                      <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 0 }}>
                          <path d="M14.1668 0.833252L5.00016 9.99992L0.833496 5.83325" stroke="#8098F9" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

