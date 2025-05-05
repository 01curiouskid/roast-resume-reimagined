
// Function to handle resume file upload and validation
export const handleResumeUpload = (file: File): Promise<{ fileUrl: string, resumeText: string }> => {
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

    // In a real implementation, we'd extract text from the PDF here
    // For now, we'll simulate extracting some text from the PDF
    extractTextFromPdf(file)
      .then(resumeText => {
        resolve({ fileUrl, resumeText });
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Function to generate a unique ID for sharing
export const generateShareableId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Extract text from PDF using PDF.js
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // For demo purposes, we'll simulate extracting text
    // In a real application, you'd use a library like PDF.js
    
    // Simulate a delay for text extraction
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate extracted resume text for demonstration
    // In a real app, you would use PDF.js or a backend service to extract actual text
    return `PROFESSIONAL RESUME
    
    John Smith
    Senior Software Engineer
    
    SUMMARY
    Results-driven software engineer with 5+ years of experience developing web applications using React, TypeScript, and Node.js. Passionate about creating efficient, maintainable code and delivering exceptional user experiences.
    
    SKILLS
    • Programming: JavaScript, TypeScript, Python, Java
    • Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
    • Backend: Node.js, Express, NestJS, Django
    • Databases: PostgreSQL, MongoDB
    • DevOps: Docker, AWS, CI/CD, Git
    
    PROFESSIONAL EXPERIENCE
    
    Senior Software Engineer
    TechCorp Inc. | Remote | Jan 2021 - Present
    • Led development of mission-critical customer portal that increased user engagement by 35%
    • Implemented automated testing that reduced bugs in production by 60%
    • Mentored junior developers and established best practices for team of 8 engineers
    • Optimized application performance resulting in 30% faster page load times
    
    Software Engineer
    WebSolutions Ltd | San Francisco, CA | Mar 2019 - Dec 2020
    • Developed responsive web applications using React and TypeScript
    • Collaborated with product managers and designers to deliver features on time
    • Reduced API response times by 40% through caching and query optimization
    • Participated in code reviews and daily stand-up meetings
    
    EDUCATION
    
    Bachelor of Science in Computer Science
    University of Technology | 2018
    
    PROJECTS
    
    E-commerce Platform (2022)
    Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL.
    Features include user authentication, product searching, and payment processing.
    
    Weather Forecasting App (2021)
    Created a weather application that displays real-time forecasts using multiple APIs.
    Implemented geolocation and interactive maps for enhanced user experience.`;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from resume');
  }
};
