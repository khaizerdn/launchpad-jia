# Career Form Overview

A comprehensive overview of the segmented career form system with validation, sanitization, and progress tracking.

---

## 1. Update the career form in the recruiter portal to be a segmented form

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

**Step Navigation:**
1. **Initial Load:**
   - New career: Starts at Step 1
   - Edit career: Loads at last saved `currentStep`

2. **Advancing Steps:**
   - User fills current step
   - Clicks "Save and Continue"
   - `validateCurrentStep()` runs
   - If valid: `currentStep` increments, data saved
   - If invalid: Errors shown, step doesn't advance

3. **Progress Bar:**
   - Shows all 5 steps
   - Highlights current step
   - Shows completion status (circle, warning, or checkmark)

**Validation Rules:**

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

### Step 2: CV Screening
**Pre-Screening Questions:**
- Optional questions can be added
- Questions support multiple types (Short Answer, Long Answer, Dropdown, Checkboxes, Range)
- Custom questions can be created with editable text input
- Questions can be reordered and deleted

### Other Steps
- Validation rules defined per step
- Each step validates before allowing progression

**Files:**
- `src/lib/components/CareerComponents/CareerForm.tsx` - Main form component, handles step navigation and validation
- `src/lib/components/CareerComponents/CareerContentDetails.tsx` - Step 1 form fields
- `src/lib/components/CareerComponents/CareerProgressBar.tsx` - Progress bar display

---

## 2. User must be able to save current progress and return to last step

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

**Saving Progress:**
- "Save as Unpublished" saves current `currentStep`
- User can return later and resume from saved step

**Files:**
- `src/lib/components/CareerComponents/CareerForm.tsx`
  - `currentStep` state (line 103)
  - `handleSaveAndContinue()` (line 194-215)
  - `saveCareer()` / `updateCareer()` - saves `currentStep` to database
- `src/app/recruiter-dashboard/careers/edit/[slug]/page.tsx` - Edit career page, loads career at last saved step

---

## 3. Add validation and sanitize input in add career API against XSS scripts and invalid HTML

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

**XSS Protection:**
All user inputs are sanitized before database storage:

```typescript
// Example: Job Title
Input:  "Developer <script>alert('XSS')</script>"
Output: "Developer " (script tag removed)

// Example: Description (allows safe HTML)
Input:  "<p>Hello</p><script>alert('XSS')</script>"
Output: "<p>Hello</p>" (script removed, safe HTML kept)
```

**Validation Layers:**
1. **Client-side:** Quick feedback, prevents unnecessary API calls
2. **Server-side:** Final validation, ensures data integrity
3. **Sanitization:** Removes dangerous content while preserving safe formatting

**System Flow:**
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

**Files:**
- `src/lib/utils/validation.ts` - Core validation functions and HTML sanitization logic
- `src/app/api/add-career/route.ts` - API endpoint for creating careers, server-side validation and sanitization

---

## 4. Update the career form in the recruiter portal to add and edit pre-screening questions

Users can add and edit pre-screening questions in Step 2 (CV Screening).

**How it works:**
- Users can add suggested questions (Notice Period, Work Setup, Asking Salary) or create custom questions
- Each question has a type dropdown: Short Answer, Long Answer, Dropdown, Checkboxes, or Range
- Custom questions use an editable input field that shows as plain text when not focused
- Questions can be reordered via drag-and-drop (using `@dnd-kit` library)
- Options can be added/removed for Dropdown and Checkboxes types
- Range type uses minimum/maximum salary inputs

**Drag and Drop Implementation:**
- Uses `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` libraries
- `DndContext` wraps the sortable list
- `useSortable` hook enables drag functionality for each question/option
- `SortableContext` manages sortable items with `verticalListSortingStrategy`
- Supports both mouse and keyboard navigation

**Question Types:**
- **Short Answer:** Single-line text input
- **Long Answer:** Multi-line text input
- **Dropdown:** Select from predefined options
- **Checkboxes:** Multiple selection from options
- **Range:** Minimum and maximum salary inputs

**Files:**
- `src/lib/components/CareerComponents/CareerContentScreening.tsx`
  - `handleAddQuestion()` - Adds suggested questions
  - `handleAddCustomQuestion()` - Creates custom question with editable input
  - `handleUpdateType()` - Updates question type
  - `handleUpdateDescription()` - Updates custom question text
  - `handleDragEnd()` - Handles question reordering
  - `handleDragOptionEnd()` - Handles option reordering within questions

---

## 5. New applicants who apply to the job post must answer the questions to proceed with their application

New applicants applying to a job posting are required to answer all pre-screening questions before they can complete their application submission.

**How it works:**
- When a job posting has pre-screening questions configured, applicants must answer them during the application process
- Questions are displayed in the order defined by the recruiter in Step 2 (CV Screening)
- Each question type (Short Answer, Long Answer, Dropdown, Checkboxes, Range) requires appropriate input
- Applicants cannot proceed to submit their application until all questions are answered
- Answers are validated and saved along with the application

**Application Flow:**
1. **Applicant Views Job Posting:**
   - Applicant navigates to the job posting page
   - Pre-screening questions are displayed if configured

2. **Question Display:**
   - Questions appear in the order set by the recruiter
   - Each question displays its type and required format
   - Questions are numbered sequentially

3. **Answer Collection:**
   - Dropdown: Select one option from list
   - Range: Enter minimum and maximum salary values

4. **Validation:**
   - All questions must be answered before submission
   - Required fields are validated
   - Format validation based on question type

5. **Application Submission:**
   - Once all questions are answered, applicant can submit
   - Answers are saved with the application
   - Application proceeds to CV screening stage

**Question Types and Requirements:**
- **Dropdown:** Must select one option from provided list
- **Range:** Must provide both minimum and maximum values (for salary questions)

**Data Storage:**
- Question answers are stored with the application
- Answers are linked to the specific question ID
- Answers are preserved for recruiter review during CV screening

**Files:**
- `src/lib/components/screens/UploadCV.tsx` - Application form that displays and collects pre-screening question answers
- `src/lib/components/screens/CVScreening.tsx` - Displays pre-screening questions and handles answer submission
- `src/lib/components/CareerComponents/CareerContentScreening.tsx` - Recruiter interface for configuring questions
- API endpoints that handle application submission with question answers

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

### Testing Pre-Screening Questions
1. Navigate to Step 2 (CV Screening)
2. Click "Add Custom" to create a custom question
3. Select question type from dropdown
4. Add options for Dropdown/Checkboxes types
5. Reorder questions via drag-and-drop

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

---

## 🔌 Backend Files and Its Usage

**src/app/api/add-career/route.ts**
- **Usage:** Creates a new career/job posting with validation, sanitization, and job limit checking.

**src/app/api/update-career/route.tsx**
- **Usage:** Updates an existing career/job posting with all form data including currentStep progress.

**src/app/api/career-data/route.tsx**
- **Usage:** Fetches a single career by MongoDB ObjectId for recruiter/admin editing or viewing.

**src/app/api/fetch-career-data/route.tsx**
- **Usage:** Fetches a single career by MongoDB ObjectId or GUID, with inactive status check and optional pre-screening-only response for candidate-facing pages.

**src/app/api/update-member/route.ts**
- **Usage:** Updates team member information and roles in a career.

---

## 🗂️ Front End Files and Its Usage

**src/lib/components/CareerComponents/CareerForm.tsx**
- **Usage:** Main form orchestrator used in `/careers/new-career` and `/careers/edit/[slug]` pages to manage the 5-step career creation/editing workflow.

**src/lib/components/CareerComponents/CareerContentCareerDetails.tsx**
- **Usage:** Step 1 component in CareerForm for editing job title, employment type, work setup, location, salary, job description, and team access.

**src/lib/components/CareerComponents/CareerContentCVReview.tsx**
- **Usage:** Step 2 component in CareerForm for configuring CV screening settings, CV secret prompts, and pre-screening questions.

**src/lib/components/CareerComponents/CareerContentAIInterview.tsx**
- **Usage:** Step 3 component in CareerForm for setting up AI interview screening, video requirements, secret prompts, and interview questions by category.

**src/lib/components/CareerComponents/CareerContentPipelineStages.tsx**
- **Usage:** Step 4 component in CareerForm for configuring pipeline stages (currently displays empty state).

**src/lib/components/CareerComponents/CareerContentReviewCareer.tsx**
- **Usage:** Step 5 (Review) component in CareerForm that displays all review cards (Career Details, CV Review, AI Interview, Pipeline Stages) in a merged, collapsible format.

**src/lib/components/CareerComponents/CareerProgressBar.tsx**
- **Usage:** Progress indicator component used in CareerForm to show current step and validation status.

**src/lib/components/Dropdown/CareerDropdown.tsx**
- **Usage:** Reusable dropdown component used across CareerContentCareerDetails, CareerContentCVReview, CareerContentAIInterview, and UploadCV_PreScreeningQuestions for consistent dropdown UI with dynamic positioning.

**src/lib/components/InputField/CareerInputField.tsx**
- **Usage:** Reusable input field component used in CareerContentCareerDetails for job title input with error handling and validation display.

**src/lib/components/screens/UploadCV.tsx**
- **Usage:** Main CV upload page component used in `/dashboard/upload-cv` route for displaying and editing uploaded CV sections with markdown stripping.

**src/lib/components/screens/UploadCV_PreScreeningQuestions.tsx**
- **Usage:** Pre-screening questions component used in UploadCV page for candidates to answer pre-screening questions before submitting their application.

**src/lib/components/LayeredCard.tsx**
- **Usage:** Reusable card wrapper component that provides consistent card styling across all career form steps.

## Style Files

**src/lib/styles/components/careerForm.module.scss**
- **Usage:** CSS module for CareerForm and related components, containing styles for mainContentContainer, sectionContainer, reviewMainContainer, member management, and form layouts.

**src/lib/styles/components/careerContentCards.module.scss**
- **Usage:** CSS module for career card components, containing shared card styles (careerCard, careerCardHeader, careerCardContent, sectionTitle, sectionDescription, fieldContainer, reviewData, reviewDivider, reviewBadge, etc.)

**src/lib/styles/components/careerPreScreeningQuestions.module.scss**
- **Usage:** CSS module for pre-screening questions UI, containing styles for question containers, drag handles, option items, add/delete buttons, and suggested questions.

**src/lib/styles/screens/uploadCV.module.scss**
- **Usage:** CSS module for UploadCV page, containing styles for section titles, section details, and CV display formatting.

**src/lib/styles/globals.scss**
- **Usage:** Global stylesheet containing form-control classes, error states, and shared utility styles used across the entire application.

---

## ⭐ Icons

All SVG icons used in the career form components are centralized in `public/iconsV3/` for better maintainability and reusability.

### Icon Files Created/Used:

**Alert Icons:**
- `alertV2.svg` - Circle alert icon with exclamation mark (used in input field error indicators)
- `alertV3.svg` - Triangle alert icon (used in error messages and progress bar)

**Arrow Icons:**
- `arrowDown.svg` - Down arrow chevron icon (used in dropdown buttons)

**Check Icons:**
- `checkV7.svg` - Checkmark icon with circular background (used in progress bar for completed steps)
- `checkV8.svg` - White checkmark icon with circular background (used in "Publish" button)

**Action Icons:**
- `edit.svg` - Edit/pencil icon (used in edit buttons)
- `plus.svg` - Circle plus icon (used in "Manually add" buttons)
- `plusV2.svg` - White plus icon (used in "Add Custom" buttons)
- `trashV2.svg` - Red trash/delete icon (used in delete buttons)

**UI Icons:**
- `bulb.svg` - Lightbulb with star icon (used in "Tips" sections)
- `question.svg` - Question mark icon (used in tooltip triggers for secret prompts)
- `sparkle.svg` - Colored sparkle/star icon with gradient (used in "Secret Prompt" sections)
- `sparkleV2.svg` - White sparkle/star icon (used in button icons)

**Status Icons:**
- `circleDot.svg` - Circle with dot icon (used in progress bar for inactive steps)

**Directories:**
- All icon files: `public/iconsV3/*.svg`
- Component files reference icons via: `<img alt="" src="/iconsV3/[icon-name].svg" />`