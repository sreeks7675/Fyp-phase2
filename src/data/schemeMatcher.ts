/* WORKING VERSION - DO NOT DELETE
import { schemes } from "./schemeData";

export const getMatchingSchemes = (userData, situationText) => {
  const text = (situationText || "").toLowerCase().trim();
  const age = parseInt(userData.age) || 0;
  const community = (userData.community || "").toLowerCase();

  console.log("[SCHEME MATCHER] Input:", { text, age, community, userData });

  return schemes.filter((scheme) => {
    // 🔍 fuzzy keyword match - check if any keyword (or word within keyword) matches
    const keywordMatch = scheme.keywords.some((kw) => {
      const normalized = kw.toLowerCase().replace(/[-_]/g, " ");
      // Check if full keyword is in text
      if (text.includes(normalized)) {
        return true;
      }
      // Also check if any word from the keyword is in the text
      const keywordWords = normalized.split(/\s+/);
      return keywordWords.some(word => word.length > 2 && text.includes(word));
    });

    // 🧓 basic eligibility checks
    const ageMatch = age >= 18 && age <= 65;
    const communityMatch =
      !scheme.eligibility.some((e) => e.toLowerCase().includes("sc/st")) ||
      /sc|st|bc|mbc|oc|obc/i.test(community);

    const matches = keywordMatch && ageMatch && communityMatch;
    if (matches) {
      console.log("[SCHEME MATCHER] Matched scheme:", scheme.id, scheme.name);
    }

    return matches;
  });
};*/

import { schemes } from "./schemeData";

const parseAgeRange = (eligibility: string[]): { min: number; max: number } => {
  for (const e of eligibility) {
    const match = e.match(/age[:\s]+(\d+)\s*[-–]\s*(\d+)/i);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
  }
  return { min: 18, max: 65 }; // default if no age criteria found
};

/*const parseIncomeLimit = (eligibility: string[]): number | null => {
  for (const e of eligibility) {
    // Match patterns like "below ₹4,50,000" or "below 450000"
    const match = e.match(/income\s+below\s+[₹]?([\d,]+)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ""));
    }
  }
  return null; // no income criteria for this scheme
};*/
const parseIncome = (earning: string): number => {
  if (!earning) return 0;
  const s = earning.toString().toLowerCase().trim();
  
  const lakhMatch = s.match(/(\d+(?:\.\d+)?)\s*lakh/);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);
  
  const thousandMatch = s.match(/(\d+(?:\.\d+)?)\s*thousand/);
  if (thousandMatch) return Math.round(parseFloat(thousandMatch[1]) * 1000);
  
  const plain = parseInt(s.replace(/,/g, ""));
  if (!isNaN(plain)) {
    if (plain < 100) return plain * 100000;
    if (plain < 1000) return plain * 1000;
    return plain;
  }
  return 0;
};

const parseIncomeLimit = (eligibility: string[]): number | null => {
  for (const e of eligibility) {
    const match = e.match(/income\s+below\s+[₹]?([\d,]+)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ""));
    }
  }
  return null;
};

export const getMatchingSchemes = (userData, situationText) => {
  const text = (situationText || "").toLowerCase().trim();
  const age = parseInt(userData.age) || 0;
  const income = parseIncome(userData.yearlyEarning);
  const community = (userData.community || "").toLowerCase();

  console.log("[SCHEME MATCHER] Input:", { text, age, income, community, userData });

  return schemes.filter((scheme) => {
    // Keyword match
    const keywordMatch = scheme.keywords.some((kw) => {
      const normalized = kw.toLowerCase().replace(/[-_]/g, " ");
      if (text.includes(normalized)) return true;
      const keywordWords = normalized.split(/\s+/);
      return keywordWords.some(word => word.length > 2 && text.includes(word));
    });

    // Per-scheme age check
    const { min: ageMin, max: ageMax } = parseAgeRange(scheme.eligibility);
    const ageMatch = age >= ageMin && age <= ageMax;

    // Per-scheme income check (only applied if scheme defines an income limit)
    const incomeLimit = parseIncomeLimit(scheme.eligibility);
    const incomeMatch = incomeLimit === null || income <= incomeLimit;

    // Community check (unchanged)
    const communityMatch =
      !scheme.eligibility.some((e) => e.toLowerCase().includes("sc/st")) ||
      /sc|st|bc|mbc|oc|obc/i.test(community);

    const matches = keywordMatch && ageMatch && incomeMatch && communityMatch;
    if (matches) {
      console.log("[SCHEME MATCHER] Matched scheme:", scheme.id, scheme.name, { ageMin, ageMax, incomeLimit });
    } else {
      console.log("[SCHEME MATCHER] No match:", scheme.id, { keywordMatch, ageMatch, incomeMatch, communityMatch });
    }

    return matches;
  });
};