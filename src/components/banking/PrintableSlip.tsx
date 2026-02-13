import { PassbookData, BankingServiceType, ServicePayload } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrintableSlip({
  passbook,
  service,
  payload,
}: {
  passbook: PassbookData;
  service: BankingServiceType;
  payload: ServicePayload;
}) {
  return (
    <Card className="p-8 space-y-4 print:p-0">
      <h1 className="text-center text-xl font-bold">Bank Slip</h1>
      <p>Name: {passbook.accountHolderName}</p>
      <p>Account: {passbook.accountNumber}</p>
      <p>Service: {service}</p>
      <p>Amount: ₹{payload.amount}</p>

      <div className="mt-8">Signature:</div>

      <Button onClick={() => window.print()} className="print:hidden">
        Print
      </Button>
    </Card>
  );
}
