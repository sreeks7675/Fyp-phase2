/*import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function IdentityVerification({
  passbook,
  onVerified,
}: any) {

  const [file, setFile] = useState<File | null>(null);
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");

  const extractAadhaar = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5071/aadhaar/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setAadhaarData(data);
  };

  const initiateVerification = async () => {
    const res = await fetch("http://localhost:5071/verify/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passbookName: passbook.accountHolderName,
        aadhaarData
      }),
    });

    const result = await res.json();

    if (result.status === "otp_sent") {
      setMobile(result.mobile);
      alert("OTP sent (check backend console)");
    } else {
      alert("Name mismatch");
    }
  };

  const confirmOtp = async () => {
    const res = await fetch("http://localhost:5071/verify/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile,
        otp
      }),
    });

    const result = await res.json();

    if (result.status === "verified") {
      onVerified({ verified: true });
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Aadhaar Verification</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={extractAadhaar}>
        Extract Aadhaar
      </Button>

      {aadhaarData && (
        <>
          <Button onClick={initiateVerification}>
            Send OTP
          </Button>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button onClick={confirmOtp}>
            Verify OTP
          </Button>
        </>
      )}
    </Card>
  );
}*/

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function IdentityVerification({
  passbook,
  onVerified,
}: any) {
  const [file, setFile] = useState<File | null>(null);
  const [aadhaarData, setAadhaarData] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 STEP 1 — Extract Aadhaar
  const extractAadhaar = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5071/aadhaar/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAadhaarData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to extract Aadhaar");
    }

    setLoading(false);
  };

  // 🔹 STEP 2 — Name match + send OTP via Appwrite
  const initiateVerification = async () => {
    const res = await fetch("http://localhost:5071/verify/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaarData }),
    });

    const result = await res.json();

    if (result.status === "otp_sent") {
      setMobile(result.mobile);
      setOtpSent(true);
      alert("OTP sent to mobile");
    } else {
      alert(result.message);
    }
  };

  const confirmOtp = async () => {
    const res = await fetch("http://localhost:5071/verify/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile,
        otp,
      }),
    });

    const result = await res.json();

    if (result.status === "verified") {
      onVerified({ verified: true });
    } else {
      alert("Invalid OTP");
    }
  };


  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Aadhaar Verification</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={extractAadhaar} disabled={!file || loading}>
        {loading ? "Processing..." : "Extract Aadhaar"}
      </Button>

      {aadhaarData && !otpSent && (
        <Button onClick={initiateVerification} disabled={loading}>
          Send OTP
        </Button>
      )}

      {otpSent && (
        <>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button onClick={confirmOtp}>
            Verify OTP
          </Button>
        </>
      )}
    </Card>
  );
}

