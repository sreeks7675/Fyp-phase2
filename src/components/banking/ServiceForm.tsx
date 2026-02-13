import { PassbookData, BankingServiceType, ServicePayload } from "./types";
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

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">{service.toUpperCase()}</h2>

      <p>Account: {passbook.accountNumber}</p>

      <Input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Button onClick={() => onSubmit({ amount: Number(amount) })}>
        Generate Slip
      </Button>
    </Card>
  );
}
