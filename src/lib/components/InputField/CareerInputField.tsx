"use client";

import { useState, useRef, useEffect } from "react";

interface CareerInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password" | "tel" | "url";
  error?: string;
  onErrorClear?: () => void;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

export default function CareerInputField({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  onErrorClear,
  prefix,
  suffix,
  className = "form-control",
  disabled = false,
  min,
  max,
  onWheel,
  id,
  name,
  autoFocus = false,
}: CareerInputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
  };

  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;
  const hasError = !!error;

  // Calculate padding based on prefix/suffix/error
  const paddingLeft = hasPrefix ? "28px" : undefined;
  const paddingRight = hasSuffix 
    ? (hasError ? "60px" : "35px")
    : (hasError ? "35px" : undefined);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Prefix */}
      {prefix && (
        <div style={{ 
          position: "absolute", 
          left: "12px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          color: "#6c757d", 
          fontSize: "16px", 
          pointerEvents: "none",
          zIndex: 1
        }}>
          {typeof prefix === "string" ? prefix : prefix}
        </div>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        autoFocus={autoFocus}
        style={{
          width: "100%",
          border: hasError 
            ? "1px solid var(--Input-border-destructive, #FDA29B) !important" 
            : undefined,
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          outline: "none",
        }}
        onChange={handleChange}
        onWheel={onWheel}
        onFocus={(e) => e.currentTarget.style.outline = "none"}
        onBlur={(e) => e.currentTarget.style.outline = "none"}
      />

      {/* Error Icon */}
      {hasError && (
        <div style={{ 
          position: "absolute", 
          right: hasSuffix ? "50px" : "12px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          pointerEvents: "none",
          zIndex: 1
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M7.33341 4.66666V7.33332M7.33341 9.99999H7.34008M14.0001 7.33332C14.0001 11.0152 11.0153 14 7.33341 14C3.65152 14 0.666748 11.0152 0.666748 7.33332C0.666748 3.65142 3.65152 0.666656 7.33341 0.666656C11.0153 0.666656 14.0001 3.65142 14.0001 7.33332Z" 
              stroke="#F04438" 
              strokeWidth="1.33333" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Suffix */}
      {suffix && (
        <div style={{ 
          position: "absolute", 
          right: "12px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          color: "#6c757d", 
          fontSize: "16px", 
          pointerEvents: "none",
          zIndex: 1
        }}>
          {typeof suffix === "string" ? suffix : suffix}
        </div>
      )}
    </div>
  );
}

