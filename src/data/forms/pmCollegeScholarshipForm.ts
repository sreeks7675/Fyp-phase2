export const pmCollegeScholarshipForm = [
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
    section: "Academic Details",
    fields: [
      { key: "institutionName", label: "Institution Name", labelTa: "கல்வி நிறுவனத்தின் பெயர்", editable: false },
      { key: "courseType", label: "Course Type", labelTa: "படிப்பு வகை", editable: false },
      { key: "courseYear", label: "Year of Study", labelTa: "படிக்கும் ஆண்டு", editable: false },
      { key: "boardPercentile", label: "Class 12 Percentile", labelTa: "12ஆம் வகுப்பு பெர்சென்டைல்", editable: false },
    ],
  },
  {
    section: "Financial Details",
    fields: [
      { key: "familyIncome", label: "Annual Family Income", labelTa: "குடும்ப ஆண்டு வருமானம்", editable: false },
      { key: "aadhaarBankLinked", label: "Aadhaar-seeded Bank Account", labelTa: "ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு", editable: false },
      { key: "otherScholarship", label: "Other Scholarship Availed", labelTa: "வேறு உதவித்தொகை பெறுகிறீர்களா", editable: false },
    ],
  },
];