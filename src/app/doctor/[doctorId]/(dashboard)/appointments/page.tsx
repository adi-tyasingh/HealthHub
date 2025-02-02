'use client';
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Trash2, AlertCircle, Pill, Printer } from 'lucide-react';

interface Medication {
  dosageUnits: string;
  commonDosages: number[];
  frequencies: string[];
  warnings: string[];
  interactions: string[];
}

interface CommonMedications {
  [key: string]: Medication;
}

interface PatientInfo {
  name: string;
  age: string;
  weight: string;
  allergies: string;
  currentMedications: string;
}

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: string;
  endDate: string;
}

interface PrintableContentProps {
  patientInfo: PatientInfo;
  prescriptions: Prescription[];
  commonMedications: CommonMedications;
}

const PrintableContent: React.FC<PrintableContentProps> = ({ patientInfo, prescriptions, commonMedications }) => (
  <div className="p-8 bg-white">
    <div className="mb-8 border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-bold mb-2">Medical Prescription</h1>
      <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <p><span className="font-medium">Name:</span> {patientInfo.name}</p>
        <p><span className="font-medium">Age:</span> {patientInfo.age}</p>
        <p><span className="font-medium">Weight:</span> {patientInfo.weight} kg</p>
        {patientInfo.allergies && (
          <p><span className="font-medium">Allergies:</span> {patientInfo.allergies}</p>
        )}
      </div>
      {patientInfo.currentMedications && (
        <p className="mt-4">
          <span className="font-medium">Current Medications:</span> {patientInfo.currentMedications}
        </p>
      )}
    </div>

    <div>
      <h2 className="text-lg font-semibold mb-4">Prescribed Medications</h2>
      {prescriptions.map((prescription, index) => (
        <div key={index} className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="font-medium mb-2">Prescription {index + 1}</h3>
          {prescription.medication && (
            <div className="grid gap-2">
              <p>
                <span className="font-medium">Medication:</span> {prescription.medication} - {prescription.dosage}
                {commonMedications[prescription.medication]?.dosageUnits}
              </p>
              <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
              <p><span className="font-medium">Duration:</span> {prescription.duration}</p>
              <p><span className="font-medium">Start Date:</span> {prescription.startDate}</p>
              <p><span className="font-medium">End Date:</span> {prescription.endDate}</p>
              {prescription.instructions && (
                <p><span className="font-medium">Special Instructions:</span> {prescription.instructions}</p>
              )}
              <div className="mt-2">
                <p className="font-medium">Warnings:</p>
                <ul className="list-disc pl-4">
                  {commonMedications[prescription.medication].warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const PrescriptionManager: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: '',
    weight: '',
    allergies: '',
    currentMedications: ''
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    startDate: '',
    endDate: ''
  }]);

  const [showWarnings, setShowWarnings] = useState<boolean>(false);
  const [currentWarnings, setCurrentWarnings] = useState<string[]>([]);
  const printContentRef = useRef<HTMLDivElement>(null);

  const commonMedications: CommonMedications = {
    "Amoxicillin": {
      dosageUnits: "mg",
      commonDosages: [250, 500, 875],
      frequencies: ["Every 8 hours", "Every 12 hours"],
      warnings: ["Take with food", "Complete full course", "May cause diarrhea"],
      interactions: ["Alcohol", "Probenecid", "Methotrexate"]
    },
    "Ibuprofen": {
      dosageUnits: "mg",
      commonDosages: [200, 400, 600, 800],
      frequencies: ["Every 4-6 hours", "Every 8 hours"],
      warnings: ["Take with food", "Do not exceed 3200mg per day"],
      interactions: ["Aspirin", "Blood thinners", "ACE inhibitors"]
    },
    "Omeprazole": {
      dosageUnits: "mg",
      commonDosages: [20, 40],
      frequencies: ["Once daily", "Twice daily"],
      warnings: ["Take before meals", "Long-term use may increase fracture risk"],
      interactions: ["Clopidogrel", "Iron supplements", "Vitamin B12"]
    }
  };

  const checkInteractions = (medication: string, currentMeds: string): string[] => {
    const warnings: string[] = [];
    if (commonMedications[medication]) {
      const interactions = commonMedications[medication].interactions;
      interactions.forEach(interaction => {
        if (currentMeds.toLowerCase().includes(interaction.toLowerCase())) {
          warnings.push(`⚠️ Potential interaction between ${medication} and ${interaction}`);
        }
      });
    }
    return warnings;
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string): void => {
    const newPrescriptions = prescriptions.map((prescription, i) => {
      if (i === index) {
        const updatedPrescription = { ...prescription, [field]: value };
        
        if (field === 'medication') {
          const warnings = checkInteractions(value, patientInfo.currentMedications);
          setCurrentWarnings(warnings);
          setShowWarnings(warnings.length > 0);
        }
        
        return updatedPrescription;
      }
      return prescription;
    });
    setPrescriptions(newPrescriptions);
  };

  const addPrescription = (): void => {
    setPrescriptions([...prescriptions, {
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const removePrescription = (index: number): void => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  const handlePrint = (): void => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printContentRef.current) {
      const printContent = `
        <html>
          <head>
            <title>Prescription - ${patientInfo.name}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body>
            ${printContentRef.current.outerHTML}
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              }
            </script>
          </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const canPrint = (): boolean => {
    return Boolean(patientInfo.name && prescriptions.some(p => p.medication && p.dosage && p.frequency));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-6 h-6" />
            Prescription Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient Name*</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={patientInfo.weight}
                onChange={(e) => setPatientInfo({...patientInfo, weight: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Known Allergies</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={patientInfo.allergies}
                onChange={(e) => setPatientInfo({...patientInfo, allergies: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Current Medications</label>
              <textarea
                className="w-full p-2 border rounded"
                value={patientInfo.currentMedications}
                onChange={(e) => setPatientInfo({...patientInfo, currentMedications: e.target.value})}
                rows={2}
              />
            </div>
          </div>

          {/* Prescriptions */}
          {prescriptions.map((prescription, index) => (
            <div key={index} className="p-4 border rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Prescription {index + 1}</h3>
                {prescriptions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrescription(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medication*</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={prescription.medication}
                    onChange={(e) => updatePrescription(index, 'medication', e.target.value)}
                  >
                    <option value="">Select Medication</option>
                    {Object.keys(commonMedications).map(med => (
                      <option key={med} value={med}>{med}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Dosage</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={prescription.dosage}
                    onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                    disabled={!prescription.medication}
                  >
                    <option value="">Select Dosage</option>
                    {prescription.medication && 
                      commonMedications[prescription.medication].commonDosages.map(dosage => (
                        <option key={dosage} value={dosage}>
                          {dosage} {commonMedications[prescription.medication].dosageUnits}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={prescription.frequency}
                    onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                    disabled={!prescription.medication}
                  >
                    <option value="">Select Frequency</option>
                    {prescription.medication &&
                      commonMedications[prescription.medication].frequencies.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 7 days"
                    value={prescription.duration}
                    onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={prescription.startDate}
                    onChange={(e) => updatePrescription(index, 'startDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={prescription.endDate}
                    onChange={(e) => updatePrescription(index, 'endDate', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Special Instructions</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={prescription.instructions}
                    onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {showWarnings && currentWarnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {currentWarnings.map((warning, i) => (
                      <p key={i}>{warning}</p>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          {/* Add Prescription Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={addPrescription}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Prescription
          </Button>

          {/* Print Button */}
          <div className="flex justify-end">
            <Button
              onClick={handlePrint}
              disabled={!canPrint()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Prescription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Printable Content */}
      <div className="hidden">
        <div ref={printContentRef}>
          <PrintableContent
            patientInfo={patientInfo}
            prescriptions={prescriptions}
            commonMedications={commonMedications}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManager;