
// Function to handle resume file upload and validation
export const handleResumeUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.type.includes('pdf')) {
      reject(new Error('Only PDF files are supported'));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File size must be less than 5MB'));
      return;
    }

    // Create a blob URL for the file
    const fileUrl = URL.createObjectURL(file);
    resolve(fileUrl);
  });
};

// Function to generate a unique ID for sharing
export const generateShareableId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock function for PDF text extraction (would be replaced with a real backend service)
export const extractTextFromPdf = (): Promise<string> => {
  return new Promise((resolve) => {
    // In a real app, we would send the PDF to a backend service
    // and extract the text. For now, we'll just simulate a delay.
    setTimeout(() => {
      resolve("Resume text extracted successfully!");
    }, 2000);
  });
};
