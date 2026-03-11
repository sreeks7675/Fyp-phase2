export type BankingStep =
  | "scan"
  | "confirm"
  | "otp"
  | "select-service"
  | "service-form"
  | "signature"
  | "print";

export interface PassbookData {
  accountHolderName: string;
  accountNumber: string;
  accountType: string;
  branchName: string;
  ifsc: string;
  cif: string;
  balance?: number;   // ADD THIS
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
  amountWords?: string;
  beneficiaryName?: string;
  balanceAfter?:number;
  purpose?: string;
}
