import { BankingServiceType } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PassbookData } from "./types";

export default function ServiceSelector({
  onSelect,
  passbook,
}: {
  onSelect: (s: BankingServiceType) => void;
  passbook:PassbookData;
}) {
  const services = [
    {
      key: "withdrawal" as BankingServiceType,
      title: "Cash Withdrawal Slip",
      description:
        "Withdraw cash from your savings or current account using a withdrawal slip.",
    },
    {
      key: "payin" as BankingServiceType,
      title: "Cash Deposit (Pay-in Slip)",
      description:
        "Deposit cash into your account using a standard pay-in slip.",
    },
    {
      key: "dd" as BankingServiceType,
      title: "Demand Draft Application",
      description:
        "Request a Demand Draft for payments such as fees, institutions, or official purposes.",
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center">
        Select Banking Service
      </h2>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.key}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-medium mb-1">
              {service.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-3">
              {service.description}
            </p>

            <Button
        className="w-full"
        disabled={
          service.key === "dd" &&
          passbook.accountType.toLowerCase().includes("basic")
        }
        onClick={() => onSelect(service.key)}
      >
        {service.key === "dd" &&
        passbook.accountType.toLowerCase().includes("basic")
          ? "Not Available for Basic Savings"
          : "Proceed"}
</Button>

          </div>
        ))}
      </div>
    </Card>
  );
}
