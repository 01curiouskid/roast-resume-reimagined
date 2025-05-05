
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

    // Extract text from the PDF
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
    Results-driven software engineer with 5+ years of experience developing web applications using React, TypeScript, and Node.js. Passionate about creating efficient, maintainable code and delivering exceptional user experiences. Strong background in frontend architecture and performance optimization.
    
    SKILLS
    • Programming: JavaScript, TypeScript, Python, Java, Go
    • Frontend: React, Redux, HTML5, CSS3, Tailwind CSS, NextJS
    • Backend: Node.js, Express, NestJS, Django, FastAPI
    • Databases: PostgreSQL, MongoDB, Redis, DynamoDB
    • DevOps: Docker, Kubernetes, AWS, CI/CD, Git, GitHub Actions
    • Testing: Jest, React Testing Library, Cypress, Playwright
    
    PROFESSIONAL EXPERIENCE
    
    Senior Software Engineer
    TechCorp Inc. | Remote | Jan 2021 - Present
    • Led development of mission-critical customer portal that increased user engagement by 35%
    • Implemented automated testing that reduced bugs in production by 60%
    • Mentored junior developers and established best practices for team of 8 engineers
    • Optimized application performance resulting in 30% faster page load times
    • Established A/B testing framework that increased conversion rates by 15%
    • Implemented GraphQL API to replace REST endpoints, reducing data transfer by 40%
    
    Software Engineer
    WebSolutions Ltd | San Francisco, CA | Mar 2019 - Dec 2020
    • Developed responsive web applications using React and TypeScript
    • Collaborated with product managers and designers to deliver features on time
    • Reduced API response times by 40% through caching and query optimization
    • Participated in code reviews and daily stand-up meetings
    • Created reusable component library that improved development velocity by 25%
    • Migrated legacy codebase to modern React patterns and TypeScript
    
    Junior Developer
    StartupX | New York, NY | Jun 2018 - Feb 2019
    • Built interactive UI components using jQuery and Bootstrap
    • Assisted with database schema design and optimization
    • Participated in Agile development process and sprint planning
    
    EDUCATION
    
    Bachelor of Science in Computer Science
    University of Technology | 2018
    • GPA: 3.8/4.0
    • Coursework: Data Structures, Algorithms, Database Systems, Web Development
    • President of Coding Club, Organized annual hackathon with 200+ participants
    
    PROJECTS
    
    E-commerce Platform (2022)
    Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL.
    Features include user authentication, product searching, and payment processing.
    Implemented CI/CD pipeline with automated testing and deployment.
    
    Weather Forecasting App (2021)
    Created a weather application that displays real-time forecasts using multiple APIs.
    Implemented geolocation and interactive maps for enhanced user experience.
    Optimized for mobile devices with offline caching capabilities.
    
    Personal Blog (2020)
    Developed a personal blog using Gatsby and MDX for content management.
    Implemented SEO optimization techniques that increased organic traffic by 45%.
    Designed and implemented custom theme with dark mode support.`;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from resume');
  }
};
