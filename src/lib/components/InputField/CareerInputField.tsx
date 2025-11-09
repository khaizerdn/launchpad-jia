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
          <img alt="" src="/iconsV3/alertV2.svg" />
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

