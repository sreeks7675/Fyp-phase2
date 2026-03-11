/*import { PassbookData, BankingServiceType, ServicePayload } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ServiceForm({
  service,
  passbook,
  onSubmit,
}: {
  service: BankingServiceType;
  passbook: PassbookData;
  onSubmit: (p: ServicePayload) => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const balance = passbook.balance || 0;

  const handleWithdrawal = () => {
    const amt = Number(amount);

    if (!amt || amt <= 0) {
      setError("Enter valid withdrawal amount");
      return;
    }

    if (amt > balance) {
      setError("Insufficient balance");
      return;
    }

    setError("");
    onSubmit({ amount: amt });
  };

  if (service !== "withdrawal") return null;

  return (
    <Card className="p-6 space-y-5">
      <h2 className="text-xl font-semibold text-center">
        Cash Withdrawal Slip
      </h2>

      {/* Account Details *//*}
      <div className="space-y-1 text-sm">
        <p><strong>Name:</strong> {passbook.accountHolderName}</p>
        <p><strong>Account Number:</strong> {passbook.accountNumber}</p>
        <p><strong>Account Type:</strong> {passbook.accountType}</p>
        <p><strong>Branch:</strong> {passbook.branchName}</p>
      </div>

      {/* Balance Display *//*}
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-sm">
          <strong>Available Balance:</strong> ₹ {balance.toFixed(2)}
        </p>
      </div>

      {/* Withdrawal Input *//*}
      <div>
        <label className="text-sm font-medium">
          Amount to Withdraw (₹)
        </label>
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <Button className="w-full" onClick={handleWithdrawal}>
        Generate Withdrawal Slip
      </Button>
    </Card>
  );
}*/
import { PassbookData, BankingServiceType, ServicePayload } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

function numberToWords(num: number) {
  if (!num) return "";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    return n.toString();
  };

  return inWords(num).trim() + " Only";
}

export default function ServiceForm({
  service,
  passbook,
  onSubmit,
}: {
  service: BankingServiceType;
  passbook: PassbookData;
  onSubmit: (p: ServicePayload) => void;
}) {
  const [amount, setAmount] = useState("");

  // demo balance (later API)
  const currentBalance = passbook.balance ?? 5000;

  const numericAmount = Number(amount) || 0;

  const insufficient = service === "withdrawal" && numericAmount > currentBalance;

  const amountWords = useMemo(() => numberToWords(numericAmount), [numericAmount]);

  const ddDisabled = passbook.accountType?.toLowerCase().includes("basic");

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">{service.toUpperCase()}</h2>

      <p>Account: {passbook.accountNumber}</p>
      <p>Balance: ₹{currentBalance}</p>

      {/* Amount */}
      {(service === "withdrawal" || service === "payin" || service === "dd") && (
        <>
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {numericAmount > 0 && (
            <p className="text-sm text-muted-foreground">
              Amount in words: {amountWords}
            </p>
          )}
        </>
      )}

      {/* Insufficient popup */}
      {insufficient && (
        <p className="text-red-600 font-medium">
          Insufficient balance
        </p>
      )}

      {/* DD disabled */}
      {service === "dd" && ddDisabled && (
        <p className="text-red-600 font-medium">
          Demand Draft not allowed for Basic Savings
        </p>
      )}

      <Button
        disabled={insufficient || (service === "dd" && ddDisabled)}
        onClick={() =>
          onSubmit({
            amount: numericAmount,
            amountWords,
            balanceAfter: currentBalance - numericAmount,
          })
        }
      >
        Generate Slip
      </Button>
    </Card>
  );
}

