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
