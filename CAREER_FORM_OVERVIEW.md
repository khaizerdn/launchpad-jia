# Career Form Overview

A comprehensive overview of the segmented career form system with validation, sanitization, and progress tracking.

---

## 🎯 Key Features

### 1. Segmented Form
The career form is divided into **5 steps** that users must complete sequentially:
- **Step 1:** Career Details & Team Access
- **Step 2:** CV Screening
- **Step 3:** AI Interview Setup
- **Step 4:** Pipeline
- **Step 5:** Review

**How it works:**
- Users navigate between steps using the "Save and Continue" button
- Progress bar shows current step and completion status
- Each step must be validated before proceeding

### 2. Progress Saving
Users can save their current progress and return to the last step later.

**How it works:**
- `currentStep` is saved to the database when:
  - User clicks "Save and Continue" (advances to next step)
  - User clicks "Save as Unpublished" (saves current progress)
- When editing a career, the form loads at the last saved step
- Progress is preserved across browser sessions

**Code Flow:**
```
User clicks "Save and Continue"
  ↓
validateCurrentStep() - Validates current step
  ↓
If valid → setCurrentStep(currentStep + 1)
  ↓
API saves currentStep to database
  ↓
Form displays next step
```

**File:** `src/lib/components/CareerComponents/CareerForm.tsx`
- `currentStep` state (line 103)
- `handleSaveAndContinue()` (line 194-215)
- `saveCareer()` / `updateCareer()` - saves `currentStep` to database

---

## 🔒 Security Features

### Input Validation & Sanitization
All user inputs are validated and sanitized to prevent XSS attacks and invalid data.

**What gets sanitized:**
- `<script>` tags → Removed
- `<iframe>` tags → Removed
- Event handlers (`onclick`, `onerror`, etc.) → Removed
- `javascript:` protocols → Removed
- Dangerous HTML tags → Removed
- Safe HTML tags (`<p>`, `<strong>`, `<em>`, etc.) → Preserved

**Validation includes:**
- Required field checks
- String length limits
- Number format validation
- Email format validation
- ObjectId format validation
- Array structure validation

**Files:**
- `src/lib/utils/validation.ts` - Core validation functions
- `src/app/api/add-career/route.ts` - Server-side validation

---

## 📊 System Flow

```
┌─────────────────────────────────────────┐
│ 1. User Input (Frontend)                │
│    File: CareerForm.tsx                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Client-Side Validation               │
│    - validateCurrentStep()              │
│    - Shows errors if invalid            │
└──────────────┬──────────────────────────┘
               │
               ▼ (If valid)
┌─────────────────────────────────────────┐
│ 3. API Request                          │
│    POST /api/add-career                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Server-Side Validation               │
│    - validateString()                   │
│    - validateNumber()                   │
│    - validateArray()                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. HTML Sanitization                    │
│    - sanitizeHTML() removes dangerous   │
│      content                            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 6. Database Storage                     │
│    - Clean, sanitized data saved        │
│    - currentStep saved for progress     │
└─────────────────────────────────────────┘
```

---

## 📁 Key Files

### Frontend Components
- **`src/lib/components/CareerComponents/CareerForm.tsx`**
  - Main form component
  - Handles step navigation and validation
  - Manages `currentStep` state

- **`src/lib/components/CareerComponents/CareerContentDetails.tsx`**
  - Step 1 form fields
  - Displays validation errors

- **`src/lib/components/CareerComponents/CareerProgressBar.tsx`**
  - Progress bar display
  - Shows step completion status

### Backend
- **`src/app/api/add-career/route.ts`**
  - API endpoint for creating careers
  - Server-side validation and sanitization
  - Saves `currentStep` to database

- **`src/lib/utils/validation.ts`**
  - Validation utility functions
  - HTML sanitization logic

### Edit Page
- **`src/app/recruiter-dashboard/careers/edit/[slug]/page.tsx`**
  - Edit career page
  - Loads career at last saved step

---

## 🔄 Step Navigation

### How Steps Work

1. **Initial Load:**
   - New career: Starts at Step 1
   - Edit career: Loads at last saved `currentStep`

2. **Advancing Steps:**
   - User fills current step
   - Clicks "Save and Continue"
   - `validateCurrentStep()` runs
   - If valid: `currentStep` increments, data saved
   - If invalid: Errors shown, step doesn't advance

3. **Saving Progress:**
   - "Save as Unpublished" saves current `currentStep`
   - User can return later and resume from saved step

4. **Progress Bar:**
   - Shows all 5 steps
   - Highlights current step
   - Shows completion status (circle, warning, or checkmark)

---

## ✅ Validation Rules

### Step 1: Career Details & Team Access
**Required Fields:**
- Job Title
- Job Description
- Employment Type
- Work Arrangement
- Province
- City
- Minimum Salary
- Maximum Salary
- At least one team member with "Job Owner" role

**Validation:**
- All fields must be filled
- Salaries must be > 0
- Maximum salary must be > minimum salary
- Job Owner must be assigned

### Other Steps
- Validation rules defined per step
- Each step validates before allowing progression

---

## 🛡️ Security Implementation

### XSS Protection
All user inputs are sanitized before database storage:

```typescript
// Example: Job Title
Input:  "Developer <script>alert('XSS')</script>"
Output: "Developer " (script tag removed)

// Example: Description (allows safe HTML)
Input:  "<p>Hello</p><script>alert('XSS')</script>"
Output: "<p>Hello</p>" (script removed, safe HTML kept)
```

### Validation Layers
1. **Client-side:** Quick feedback, prevents unnecessary API calls
2. **Server-side:** Final validation, ensures data integrity
3. **Sanitization:** Removes dangerous content while preserving safe formatting

---

## 📝 Quick Reference

### Testing the Segmented Form
1. Navigate to: `http://localhost:3000/recruiter-dashboard/careers/add`
2. Fill Step 1 fields
3. Click "Save and Continue" → Advances to Step 2
4. Click "Save as Unpublished" → Saves progress, can return later

### Testing Progress Saving
1. Create a new career, fill Step 1
2. Click "Save as Unpublished"
3. Click "Edit Career" from dashboard
4. Form should load at Step 1 (last saved step)

### Testing Validation
1. Leave required field empty
2. Click "Save and Continue"
3. Red border and error message appear
4. Form does not advance to next step

### Testing XSS Protection
1. Enter: `Test <script>alert('XSS')</script>` in any field
2. Submit form
3. Check database - script tag should be removed
4. View saved career - no script execution

---

## 🔍 Troubleshooting

**Issue:** Form doesn't advance to next step
- **Check:** Validation errors in browser console
- **Check:** All required fields filled
- **Check:** Network tab for API errors

**Issue:** Progress not saving
- **Check:** `currentStep` is included in API payload
- **Check:** Database has `currentStep` field
- **Check:** Edit page loads correct step

**Issue:** XSS content in database
- **Check:** `validation.ts` is imported in API route
- **Check:** `sanitizeHTML()` is being called
- **Check:** Server logs for validation errors

---

## 📚 Additional Resources

For detailed testing instructions and code flow diagrams, see:
- Component files in `src/lib/components/CareerComponents/`
- API routes in `src/app/api/`
- Validation utilities in `src/lib/utils/validation.ts`

