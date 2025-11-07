"use client";
import { useState, useRef, useEffect } from "react";

export default function CustomDropdown(props) {
    const { onSelectSetting, screeningSetting, settingList, placeholder, allowEmpty = false, error } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      // Use setTimeout to ensure menu is rendered before calculating
      const calculatePosition = () => {
        if (buttonRef.current && menuRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          // Get actual menu height or estimate
          const menuHeight = menuRef.current.offsetHeight || 
            (settingList.some(s => s.description) ? 200 : Math.min(settingList.length * 44, 200));
          
          // Open upward if not enough space below but enough space above
          // Add some buffer (50px) to ensure menu doesn't touch viewport edge
          if (spaceBelow < menuHeight + 50 && spaceAbove > spaceBelow) {
            setOpenUpward(true);
          } else {
            setOpenUpward(false);
          }
        }
      };
      
      // Calculate immediately and after a short delay to account for rendering
      calculatePosition();
      const timeoutId = setTimeout(calculatePosition, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [dropdownOpen, settingList]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
        <div className="dropdown w-100" ref={dropdownRef} style={{ position: "relative" }}>
          <button
            ref={buttonRef}
            disabled={!allowEmpty && settingList.length === 0}
            className="dropdown-btn fade-in-bottom"
            style={{ width: "100%", textTransform: "capitalize", border: error ? "1px solid var(--Input-border-destructive, #FDA29B)" : undefined }}
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span style={!screeningSetting ? { color: "var(--Input-text-placeholder-or-disabled, #717680)", fontSize: "16px" } : { fontSize: "16px" }}>
              <i
                className={
                  settingList.find(
                    (setting) => setting.name === screeningSetting
                  )?.icon
                }
              ></i>{" "}
              {screeningSetting?.replace("_", " ") || placeholder}
            </span>
            <i className="la la-angle-down ml-10"></i>
          </button>
          {dropdownOpen && (
            <div
              ref={menuRef}
              className="dropdown-menu w-100 org-dropdown-anim show"
              style={{
                position: "absolute",
                padding: settingList.some(s => s.description) ? "8px" : "10px",
                maxHeight: settingList.some(s => s.description) ? "none" : 200,
                overflowY: settingList.some(s => s.description) ? "visible" : "auto",
                top: openUpward ? "auto" : "calc(100% + 4px)",
                bottom: openUpward ? "calc(100% + 4px)" : "auto",
                left: 0,
                right: 0,
                zIndex: 1000,
                width: "100%",
                marginTop: openUpward ? "0" : "4px",
                marginBottom: openUpward ? "4px" : "0",
              }}
            >
            {settingList.map((setting, index) => {
              const isSelected = screeningSetting === setting.name;
              const hasDescription = setting.description;
              
              return (
                <button
                  key={index}
                  className="dropdown-item"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    padding: "10px 14px",
                    color: "#181D27",
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
                    marginBottom: hasDescription ? "0" : "0",
                  }}
                  onClick={() => {
                    onSelectSetting(setting.name);
                    setDropdownOpen(false);
                  }}
                >
                  {hasDescription ? (
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: "20px" }}>
                        <span style={{ fontFamily: "Satoshi", fontStyle: "normal", fontWeight: 700, fontSize: "14px", lineHeight: "20px", color: isSelected ? "#181D27" : "#414651" }}>
                          {setting.icon && <i className={setting.icon} style={{ marginRight: "5px" }}></i>}
                          {setting.name?.replace("_", " ")}
                        </span>
                        {isSelected && (
                          <i
                            className="la la-check"
                            style={{
                              width: "20px",
                              height: "20px",
                              fontSize: "20px",
                              color: "#181D27",
                              opacity: 1
                            }}
                          ></i>
                        )}
                      </div>
                      {setting.description && (
                        <span style={{ fontFamily: "Satoshi", fontStyle: "normal", fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#717680", width: "100%" }}>
                          {setting.description}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                        {setting.icon && <i className={setting.icon}></i>} {setting.name?.replace("_", " ")}
                      </div>
                      {isSelected && (
                        <i
                          className="la la-check"
                          style={{
                            fontSize: "20px",
                            background: "linear-gradient(180deg, #9FCAED 0%, #CEB6DA 33%, #EBACC9 66%, #FCCEC0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent"
                          }}
                        ></i>
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