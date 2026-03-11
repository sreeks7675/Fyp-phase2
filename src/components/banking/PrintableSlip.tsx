import { PassbookData, BankingServiceType, ServicePayload } from "./types";

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
    <div className="p-6 print:p-0">
      <div className="max-w-xl mx-auto border p-6 space-y-4 bg-white print:border-none">

        <h1 className="text-xl font-bold text-center">
          Bank Service Slip
        </h1>

        <hr />

        <p><b>Name:</b> {passbook.accountHolderName}</p>
        <p><b>Account:</b> {passbook.accountNumber}</p>
        <p><b>Branch:</b> {passbook.branchName}</p>

        <hr />

        <p><b>Service:</b> {service.toUpperCase()}</p>
        <p><b>Amount:</b> ₹{payload.amount}</p>
        <p><b>Amount in words:</b> {payload.amountWords}</p>

        {service === "withdrawal" && (
          <p><b>Balance after:</b> ₹{payload.balanceAfter}</p>
        )}

        <hr />

        {/* Signature area */}
        <div className="flex justify-between mt-10">
          <div className="text-center">
            <div className="h-12 w-40 border-b" />
            <p>Customer Signature</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-40 border-b" />
            <p>Teller Signature</p>
          </div>
        </div>

        {/* Token */}
        <div className="mt-6 text-center text-sm">
          Token No: {Math.floor(Math.random() * 900 + 100)}
        </div>

        <button
          onClick={() => window.print()}
          className="mt-6 w-full border p-2 print:hidden"
        >
          Print Slip
        </button>
      </div>
    </div>
  );
}
