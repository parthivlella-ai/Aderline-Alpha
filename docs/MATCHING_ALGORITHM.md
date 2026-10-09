# Prismora Explainable Creator Matching Algorithm

> **Module:** `src/lib/matching/creator-matcher.ts`  
> **Philosophy:** Fully deterministic arithmetic, zero LLM hallucinations in scoring, transparent score breakdowns, and strict commercial licensing constraints.

---

## 1. Overview & Objectives

In high-stakes creative advertising, brands and agencies cannot rely on opaque, non-deterministic recommendation algorithms that hallucinate creator qualifications or silently gloss over commercial IP rights.

Prismora's Explainable Creator Matching Engine guarantees:
1. **Mathematical Determinism:** Scoring is computed purely via transparent rules and verified data attributes.
2. **Strict Licensing Enforcement:** Commercial-use permissions are treated as non-negotiable hard constraints.
3. **Actionable Explainability:** Every match is broken down into 5 weighted criteria with explicit matched items and identified capability gaps.
4. **Creator Integrity:** Qualifications, tool familiarity, and portfolio evidence are strictly sourced from active database records.

---

## 2. Scoring Formula & Breakdown (0 – 100 Points)

Every candidate creator is evaluated across five distinct categories totaling 100 points maximum:

$$ \text{Total Score} = S_{\text{content}} + S_{\text{tools}} + S_{\text{spec}} + S_{\text{format}} + S_{\text{budget}} $$

| Category | Max Points | Evaluation Basis & Deterministic Logic |
| :--- | :---: | :--- |
| **1. Content Type Compatibility** | **25 pts** | • **25 pts:** Direct verified portfolio showcase item matches `brief.target_content_type`.<br>• **15 pts:** Creator's domain specialization implies capability, but no dedicated portfolio work is uploaded.<br>• **0 pts:** Neither portfolio items nor specializations match target content type. |
| **2. AI Toolchain Overlap** | **25 pts** | Evaluates overlap between `brief.required_ai_tools` and creator's active tool pool (`creator.primary_ai_tools` $\cup$ `portfolio.ai_tools_used`):<br>$$\text{Score} = \text{round}\left(\frac{|\text{Matched Tools}|}{|\text{Required Tools}|} \times 25\right)$$<br>*(If no specific tools were required in brief, active toolchain earns 20 pts).* |
| **3. Specialization Alignment** | **25 pts** | Inferred target specializations derived from brief content type, style keywords, and objective text corpus:<br>• **25 pts:** $\ge 2$ aligned specializations.<br>• **18 pts:** 1 aligned specialization.<br>• **8 pts:** Creative specializations present but divergent.<br>• **0 pts:** No specialization data. |
| **4. Format & Aspect Ratio** | **15 pts** | • **15 pts:** Creator possesses portfolio items matching exact `brief.preferred_aspect_ratio` (e.g. `9:16`, `16:9`, `1:1`, `4:5`, `21:9`).<br>• **7 pts:** Creator has portfolio items in alternative ratios (adaptable via re-framing or re-rendering).<br>• **0 pts:** Empty portfolio. |
| **5. Budget & Availability** | **10 pts** | • **7 pts:** Starting rate $\le$ `brief.budget_max_cents`.<br>• **3 pts:** Starting rate exceeds budget by $< 20\%$.<br>• **0 pts:** Starting rate exceeds budget by $> 20\%$.<br>• **+3 pts:** Creator is marked available (`is_available === true`). |

---

## 3. Commercial Rights & Licensing Safeguards

Commercial-use requirements are **explicit constraints** and are evaluated independently of technical score:

### 3.1 Eligibility Status Rules

1. **`compatible` (Eligible):**
   - Creator explicitly grants required or broader rights (e.g., `full_buyout` covers `social_media_ads`, `broadcast`, and `digital_only`).
   - Profile terms or portfolio items confirm rights capability.

2. **`requires_confirmation` (Eligible with Notice):**
   - Creator offers commercial production, but has not formally published terms for high-tier rights like `full_buyout` or `broadcast`.
   - The creator remains eligible for ranking, but the brand is alerted with an explicit notice:
     > *"Commercial rights unconfirmed: Creator has not published perpetual buyout terms. Contractual confirmation required before agreement."*

3. **`incompatible` (Strictly Disqualified):**
   - Creator's published terms or portfolio records explicitly restrict usage to `non_commercial` or `digital_only`, directly conflicting with a brief requiring `full_buyout`, `broadcast`, or `social_media_ads`.
   - **Enforcement:** The creator is **disqualified from eligible ranking**, regardless of technical score, and moved to the *Disqualified Candidates* report with the exact conflict explained.

---

## 4. Match Tier Classification

- **Strong Match ($\ge 75$ pts):** Direct content type portfolio evidence, high toolchain overlap, aligned specializations, compatible format, and confirmed rights.
- **Moderate Match ($50 - 74$ pts):** Good technical alignment with slight format adaptability gaps or minor tool divergence.
- **Partial / Weak Match ($< 50$ pts):** Multiple capability gaps (e.g., different primary medium or budget mismatch).
- **Incompatible (Disqualified):** Commercial licensing conflict.

---

## 5. Known Limitations & Edge Cases

1. **Self-Reported vs. Verified Evidence:**
   - Unverified creators who report extensive tool usage are evaluated on stated tools. The UI pairs match scores with the creator's verification badge so brands know whether tools were audited by human review.
2. **New Creators with Thin Portfolios:**
   - A creator with high technical skill who just joined and uploaded only 1 portfolio item will receive an adaptability score (7/15) on formats they haven't explicitly showcased.
3. **Cross-Model Workflows:**
   - Some directors achieve identical visual fidelity using alternative generative pipelines (e.g., Luma vs. Runway Gen-3). The toolchain overlap criteria prioritizes brand specifications, but specialization matching partially offsets alternative tools.
