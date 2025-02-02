import jsPDF from 'jspdf';

interface PatientData {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };
    symptoms: string[];
    painLevel: number;  // Scale from 0 (no pain) to 10 (worst pain)
    appointmentDate: string;
}

export default function generatePDFReport(patientData: PatientData) {
    const doc = new jsPDF();
    const marginLeft = 20;
    let verticalOffset = 20;

    const addSection = (title: string, content: string) => {
        doc.setFontSize(16);
        doc.setTextColor(34, 139, 34); // Greenish color
        doc.text(title, marginLeft, verticalOffset);
        verticalOffset += 8;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(content, marginLeft, verticalOffset, { maxWidth: 170 });
        verticalOffset += 12;
    };

    // Title
    doc.setFontSize(22);
    doc.setTextColor(26, 51, 128); // Blueish color
    doc.text('Patient Report', marginLeft, verticalOffset);
    verticalOffset += 15;

    // Patient Data
    addSection('Patient Data:', 
        `Name: ${patientData.name}\n` +
        `Age: ${patientData.age}\n` +
        `Gender: ${patientData.gender}\n` +
        `Contact: ${patientData.contactInfo.phone}, ${patientData.contactInfo.email}\n` +
        `Address: ${patientData.contactInfo.address}`
    );

    addSection('Symptoms:', patientData.symptoms.join(', '));

    addSection('Pain Level:', patientData.painLevel.toString());

    addSection('Date of Appointment:', patientData.appointmentDate);

    doc.save(`${patientData.name.replace(/\s+/g, '_')}_Report.pdf`);
}
