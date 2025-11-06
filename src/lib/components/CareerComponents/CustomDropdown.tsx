"use client";
import { useState } from "react";

export default function CustomDropdown(props) {
    const { onSelectSetting, screeningSetting, settingList, placeholder } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
        <div className="dropdown w-100">
          <button
            disabled={settingList.length === 0}
            className="dropdown-btn fade-in-bottom"
            style={{ width: "100%", textTransform: "capitalize" }}
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span>
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
          <div
            className={`dropdown-menu w-100 mt-1 org-dropdown-anim${
              dropdownOpen ? " show" : ""
            }`}
            style={{
              padding: settingList.some(s => s.description) ? "8px" : "10px",
              maxHeight: settingList.some(s => s.description) ? "none" : 200,
              overflowY: settingList.some(s => s.description) ? "visible" : "auto",
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
        </div>
  );
}