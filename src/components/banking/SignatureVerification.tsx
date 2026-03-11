import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SignatureVerification({ passbook, onVerified }: any) {

  const [file, setFile] = useState<File | null>(null);

  const verifySignature = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountNumber", passbook.accountNumber);

    const res = await fetch(
      "http://localhost:5071/signature/verify",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await res.json();

    if (result.status === "verified") {

      alert("Signature verified");

      onVerified();

    } else {

      alert("Signature mismatch");

    }
  };

  return (
    <Card className="p-6 space-y-4">

      <h2 className="text-xl font-semibold">
        Signature Verification
      </h2>

      <Input
        type="file"
        accept="image/*"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={verifySignature}>
        Verify Signature
      </Button>

    </Card>
  );
}