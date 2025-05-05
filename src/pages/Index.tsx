
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RandomTitle from '@/components/RandomTitle';
import ResumeUploader from '@/components/ResumeUploader';
import LoadingScreen from '@/components/LoadingScreen';
import RoastDisplay from '@/components/RoastDisplay';
import { 
  generateShareableId 
} from '@/utils/resume-utils';
import { 
  generateRoast,
  saveRoastData,
  getRoastData
} from '@/utils/roast-utils';

const Index = () => {
  const [step, setStep] = useState<'upload' | 'loading' | 'display'>('upload');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isExtraSpicy, setIsExtraSpicy] = useState(false);
  const [roast, setRoast] = useState<string>('');
  const [shareableId, setShareableId] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're viewing a shared roast
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedId = params.get('id');
    
    if (sharedId) {
      setStep('loading');
      getRoastData(sharedId)
        .then(roastData => {
          if (roastData) {
            setRoast(roastData.roast);
            setIsExtraSpicy(roastData.isExtraSpicy);
            setShareableId(sharedId);
            setStep('display');
          } else {
            toast.error("This roast has expired or doesn't exist");
            navigate('/', { replace: true });
            setStep('upload');
          }
        })
        .catch(error => {
          console.error('Error fetching shared roast:', error);
          toast.error("Couldn't load the roast. It may have expired.");
          navigate('/', { replace: true });
          setStep('upload');
        });
    }
  }, [location.search, navigate]);

  const handleUploadSuccess = async (data: { fileUrl: string, resumeText: string }) => {
    setResumeUrl(data.fileUrl);
    setResumeText(data.resumeText);
    setStep('loading');
    
    try {
      // Generate roast based on the resume text and spice level
      const generatedRoast = await generateRoast(data.resumeText, isExtraSpicy);
      
      // Generate a unique ID for sharing
      const id = generateShareableId();
      
      // Save roast data for sharing
      await saveRoastData(id, generatedRoast, isExtraSpicy);
      
      setRoast(generatedRoast);
      setShareableId(id);
      setStep('display');
      
      // Update URL with the shareable ID
      navigate(`/?id=${id}`, { replace: true });
    } catch (error) {
      console.error('Error processing resume:', error);
      toast.error("Couldn't generate your roast. Please try again.");
      setStep('upload');
    }
  };

  const handleToggleSpice = async (newSpicyState: boolean) => {
    setIsExtraSpicy(newSpicyState);
    setStep('loading');
    
    try {
      // Generate a new roast with the new spice level
      const generatedRoast = await generateRoast(resumeText, newSpicyState);
      
      // Generate a new ID for sharing
      const id = generateShareableId();
      
      // Save new roast data
      await saveRoastData(id, generatedRoast, newSpicyState);
      
      setRoast(generatedRoast);
      setShareableId(id);
      setStep('display');
      
      // Update URL with the new shareable ID
      navigate(`/?id=${id}`, { replace: true });
    } catch (error) {
      console.error('Error regenerating roast:', error);
      toast.error("Couldn't update the roast. Please try again.");
      setStep('display'); // Go back to display with the old roast
    }
  };

  const handleRoastAgain = () => {
    setStep('upload');
    setResumeUrl(null);
    setResumeText('');
    navigate('/', { replace: true });
  };

  const getShareableLink = () => {
    return `${window.location.origin}/?id=${shareableId}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl mx-auto text-center">
        {step === 'upload' && (
          <>
            <RandomTitle />
            <p className="text-lg text-muted-foreground mb-10">
              Upload your resume for a brutal, hilarious roast. 
              No sugar coating, just pure comedy.
            </p>
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          </>
        )}
        
        {step === 'loading' && (
          <LoadingScreen isExtraSpicy={isExtraSpicy} />
        )}
        
        {step === 'display' && (
          <>
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              Your Resume Roast
            </h2>
            <RoastDisplay
              roast={roast}
              isExtraSpicy={isExtraSpicy}
              onToggleSpice={handleToggleSpice}
              shareableLink={getShareableLink()}
              onRoastAgain={handleRoastAgain}
            />
          </>
        )}
        
        <p className="text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} RoastMyResume - For entertainment purposes only
        </p>
      </div>
    </div>
  );
};

export default Index;
