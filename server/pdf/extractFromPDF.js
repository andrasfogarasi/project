const extractDataFromPDF = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer);
        const text = data.text;

        const birthDateMatch = text.match(/Birth Date:\s*(\d{2}\/\d{2}\/\d{4})/);
        const languageMatch = text.match(/Language:\s*(\w+)/);
        const presentationMatch = text.match(/Presentation:\s*([\w\s\d]+)/);
        const universityMatch = text.match(/University:\s*(.+)/);

        const extractedData = {
            birthDate: birthDateMatch ? birthDateMatch[1] : null,
            language: languageMatch ? languageMatch[1] : null,
            presentation: presentationMatch ? presentationMatch[1] : null,
            university: universityMatch ? universityMatch[1] : null,
        };

        return extractedData;
    } catch (error) {
        console.error('Error extracting data from PDF:', error);
        return null;
    }
};