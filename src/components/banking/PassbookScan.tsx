/*import { PassbookData } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PassbookScan({
  onExtract,
}: {
  onExtract: (data: PassbookData) => void;
}) {
  const mockExtract = () => {
    onExtract({
      accountHolderName: "EXTRACTED NAME",
      accountNumber: "XXXXXXXXXX",
      accountType: "Savings",
      branchName: "Branch Name",
      ifsc: "IFSC000123",
      cif: "CIF123456",
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Scan Passbook</h2>
      <Button onClick={mockExtract}>Upload & Extract</Button>
    </Card>
  );
}*/
import { PassbookData } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
export default function PassbookScan({
  onExtract,
}: {
  onExtract: (data: PassbookData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const uploadAndExtract = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5071/passbook/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    onExtract(data);
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Scan Passbook</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={uploadAndExtract} disabled={!file || loading}>
        {loading ? "Extracting..." : "Upload & Extract"}
      </Button>
    </Card>
  );
}

