export const pmfbyForm = [
  {
    section: "Applicant Details",
    fields: [
      { key: "name", label: "Applicant Name", labelTa: "விண்ணப்பதாரர் பெயர்", editable: false },
      { key: "age", label: "Age", labelTa: "வயது", editable: false },
      { key: "address", label: "Address", labelTa: "முகவரி", editable: false },
      { key: "community", label: "Community", labelTa: "சமூகம்", editable: false },
    ],
  },
  {
    section: "Farm & Crop Information",
    fields: [
      { key: "cropType", label: "Type of Crop", labelTa: "பயிர் வகை", editable: false },
      { key: "landArea", label: "Land Area (in acres)", labelTa: "நில பரப்பளவு (ஏக்கரில்)", editable: false },
      { key: "sowingSeason", label: "Sowing Season", labelTa: "விதைப்பு பருவம்", editable: false },
      { key: "landOwnership", label: "Land Ownership Type", labelTa: "நில உரிமை வகை", editable: false },
    ],
  },
  {
    section: "Insurance & Bank Details",
    fields: [
      { key: "previousLoss", label: "Previous Crop Loss", labelTa: "முந்தைய பயிர் இழப்பு", editable: false },
    ],
  },
];