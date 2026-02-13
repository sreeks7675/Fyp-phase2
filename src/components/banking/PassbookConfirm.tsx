/*import { PassbookData } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function PassbookConfirm({
  data,
  onConfirm,
}: {
  data: PassbookData;
  onConfirm: (d: PassbookData) => void;
}) {
  const [form, setForm] = useState(data);

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Confirm Passbook Details</h2>

      {Object.entries(form).map(([k, v]) => (
        <Input
          key={k}
          value={v}
          onChange={(e) =>
            setForm({ ...form, [k]: e.target.value })
          }
        />
      ))}

      <Button onClick={() => onConfirm(form)}>
        Confirm & Lock
      </Button>
    </Card>
  );
}*/
import { PassbookData } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function PassbookConfirm({
  data,
  onConfirm,
}: {
  data: PassbookData;
  onConfirm: (d: PassbookData) => void;
}) {
  const [form, setForm] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = [
    { key: "accountHolderName", label: "Account Holder Name" },
    { key: "accountNumber", label: "Account Number" },
    { key: "accountType", label: "Account Type" },
    { key: "branchName", label: "Branch Name" },
    { key: "ifsc", label: "IFSC Code" },
    { key: "cif", label: "Customer ID (CIF)" },
    { key: "address", label: "Address" },
    { key: "mobileNumber", label: "Mobile Number" },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      // Save edited data to backend
      const response = await fetch("http://localhost:5071/passbook/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save passbook data");
      }

      const result = await response.json();
      console.log("Passbook data saved:", result);

      // Confirm with edited data
      onConfirm(form);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error saving passbook:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        Confirm Passbook Details
      </h2>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {fields.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            {label}
          </label>

          <Input
            value={(form as any)[key] || ""}
            onChange={(e) =>
              setForm({
                ...form,
                [key]: e.target.value,
              })
            }
            disabled={loading}
          />
        </div>
      ))}

      <Button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Saving..." : "Confirm & Lock"}
      </Button>
    </Card>
  );
}

