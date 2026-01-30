# Smart Batch Selection Algorithm

The **Smart Batch Selection** algorithm is a core UX feature of the Ovasave Period Tracker. It is designed to make logging periods fast and effortless while still providing the precision needed to fix mistakes.

---

## 🕒 The Goal
Most people's periods last multiple days. Selecting each day one-by-one is tedious. Smart Batch Selection intelligently predicts when you want to log a whole period versus when you just want to adjust a single day.

---

## 🧠 How it Works (Non-Technical)

Imagine the app is watching how you interact with the calendar. It follows three simple rules:

### 1. The "Starting New" Rule (Batching)
If you click a "clean" day (a day far away from any other logged periods), the app assumes you are starting to log a new period. It automatically selects your average period length (e.g., 4 or 5 days) for you in one tap.

### 2. The "Correction" Rule (Fine-Tuning)
If you click a day that is very close to a period you **already logged**, the app assumes you are trying to "fix" that specific period (e.g., adding an extra day at the start or removing one). In this case, it only selects/deselects that **one specific day**.

### 3. The "No Overlap" Rule (Edge Protection)
If you click a day right next to an existing selection, it won't trigger a new batch. This prevents "double-batching" and keeping your logs tidy.

---

## 🛠️ Technical Implementation (For Developers)

The logic is encapsulated in the `setSelectedPeriodDate` function within the `OvulationTrackerContext`. It uses three primary checks to decide whether to `shouldBatchFill`.

### Key Logic Flow:
1. **`isEdge` Check**: Determines if the clicked date is adjacent to an already selected date.
   - *Logic*: `(isDayAfterSelected !== isDayBeforeSelected) && (isDayAfterSelected || isDayBeforeSelected)`
2. **`isNearExistingBlockStart` Check (The Correction Zone)**: Checks if the clicked date falls within a "variability window" (usually ±7 days) of any **manually logged** period start date.
   - *Purpose*: This creates a "Correction Zone" around existing logs where batching is disabled to allow for precision edits.
3. **Decision**:
   - `shouldBatchFill = !isEdge && !isNearExistingBlockStart`

### Why we removed Predictions from the logic:
Previously, the algorithm also checked against **Predicted Future Periods**. This caused a "Dead Zone" where users couldn't batch-log today if a predicted period was coming up in a few weeks. By removing the dependency on `predictedStart`, we ensures batching always works unless you are directly interacting with an **existing log**.

---

## 📊 Summary of Behavior

| Scenario | Action | Result | Why? |
| :--- | :--- | :--- | :--- |
| **New Period** | Click an empty day (far from logs) | **Batch Fill** (4-5 days) | Speed & Convenience |
| **Adjusting Log** | Click a day near a logged period | **Single Day** | Precision Correction |
| **Prediction Area** | Click near a *predicted* future period | **Batch Fill** | Predictions shouldn't block current logging |
| **Deselection** | Click an already selected day | **Deselect current + all following** | Natural "Clear" behavior |

---

## 💡 Developer Benefits
- **Deterministic**: The behavior is based only on user-provided data (existing logs).
- **Flexible**: The `cycleWindow` scales based on the user's historical cycle variability, making the "Correction Zone" smarter over time.
