import jsPDF from "jspdf";

const generatePDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    data.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 10, 20 + index * 10);
    });
    doc.save(`${title}.pdf`);
};

export { generatePDF };
