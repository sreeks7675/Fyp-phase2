export type BankingStep =
  | "scan"
  | "confirm"
  | "verify"
  | "select-service"
  | "service-form"
  | "print";

export interface PassbookData {
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  branchName: string;
  ifsc: string;
  cif: string;
}

export interface IdentityData {
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarAddress: string;
  nameMatchScore: number;
  otpVerified: boolean;
}

export type BankingServiceType = "withdrawal" | "payin" | "dd";

export interface ServicePayload {
  amount?: number;
  beneficiaryName?: string;
  purpose?: string;
}
