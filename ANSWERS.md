# Assessment Answers

### 1. How to run
*  Double-click the file named `index.html` to run.
* **Live Link:** (Paste your GitHub Pages live link here once generated!)

### 2. Stack & design choices
* **Stack choice:** used standard HTML, CSS, and basic JavaScript instead of a complex framework. As a beginner, using vanilla code allows me to understand exactly how the DOM tree works
* **Design Decision 1 (Grid Layout):** a clear 9-column CSS Grid layout instead of loose vertical bullet points. This keeps everything perfectly aligned in clean boxes, making it very easy to match up the habit names with the correct dates.
* **Design Decision 2 (Week Start):** The calendar grid is set up to start on **Sunday**. This aligns with standard calendar layouts, helping users plan out their weekly consistency metrics over the weekend.
* **Streak Logic Choice:** The streak counts up to **today** if checked, or **up to yesterday-if-today-is-unchecked**. This ensures a user doesn't lose a long-running streak first thing in the morning before they have had a chance to log their tasks.

### 3. Responsive & accessibility
* **Mobile Handling:** On narrow screens down to 360px, the grid activates horizontal scroll parameters smoothly (`overflow-x: auto;`), ensuring the tracking cells never squash or overlap.
* **Accessibility Feature:** Interactive checkmarks use standard HTML `<button>` boundaries with visual state adjustments so users can clearly tell which target element is active.
* **Skipped Feature:** Custom keyboard arrow-key navigation matrix mapping was omitted to avoid cluttering the script with complex event overrides. Standard Tab tracking navigation remains fully active.

### 4. AI usage
* **Where used:** used AI to built the habit tracker and go through the basics along the way.
