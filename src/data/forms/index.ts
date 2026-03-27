// src/data/forms/index.ts
import { tractorLoanForm } from "./tractorLoanForm";
import { kccFarmerFinanceForm } from "./kccFarmerFinanceForm";
import { twoWheelerLoanForm } from "./twoWheelerLoanForm";
import { commercialCardForm } from "./commercialCardForm";
import { creditLimitEnhancementForm } from "./creditLimitEnhancementForm";
import { pmCollegeScholarshipForm } from "./pmCollegeScholarshipForm";
import { pmfbyForm } from "./pmfbyForm";
export const FORM_REGISTRY: Record<string, any> = {
  "tractor-loan": tractorLoanForm,
  "kcc-farmer": kccFarmerFinanceForm,
  "two-wheeler": twoWheelerLoanForm,
  "commercial-card": commercialCardForm,
  "credit-limit-enhancement": creditLimitEnhancementForm,
  "pm-college": pmCollegeScholarshipForm,
  "pm-fby": pmfbyForm,
};
