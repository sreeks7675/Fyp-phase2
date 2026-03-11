import { useState } from "react";
import {
  BankingStep,
  PassbookData,
  IdentityData,
  BankingServiceType,
  ServicePayload,
} from "./types";

import PassbookScan from "./PassbookScan";
import PassbookConfirm from "./PassbookConfirm";
import IdentityVerification from "./IdentityVerification";
import ServiceSelector from "./ServiceSelector";
import ServiceForm from "./ServiceForm";
import PrintableSlip from "./PrintableSlip";
import SignatureVerification from "./SignatureVerification"

export default function PassbookFlow() {
  const [step, setStep] = useState<BankingStep>("scan");
  const [passbook, setPassbook] = useState<PassbookData | null>(null);
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [service, setService] = useState<BankingServiceType | null>(null);
  const [payload, setPayload] = useState<ServicePayload | null>(null);

  switch (step) {
    case "scan":
      return (
        <PassbookScan
          onExtract={(data) => {
            setPassbook(data);
            setStep("confirm");
          }}
        />
      );

    case "confirm":
      return (
        <PassbookConfirm
          data={passbook!}
          onConfirm={(confirmed) => {
            setPassbook(confirmed);
            setStep("otp");
          }}
        />
      );

    case "otp":
      return (
        <IdentityVerification
          passbook={passbook!}
          onVerified={() => {
            setStep("select-service");
          }}
        />
      );


    case "select-service":
      return (
        <ServiceSelector
          passbook={passbook!}
          onSelect={(s) => {
            setService(s);
            setStep("service-form");
          }}
        />

      );

    case "service-form":
      return (
        <ServiceForm
          service={service!}
          passbook={passbook!}
          onSubmit={(p) => {
            setPayload(p);
            setStep("signature");
          }}
        />
      );

    case "signature":
      return (
        <SignatureVerification
          passbook={passbook!}
          onVerified={() => {
            setStep("print");
          }}
        />
      );

    case "print":
      return (
        <PrintableSlip
          passbook={passbook!}
          service={service!}
          payload={payload!}
        />
      );

    default:
      return null;
  }
}
