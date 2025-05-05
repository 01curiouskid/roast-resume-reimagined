
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { handleResumeUpload } from '@/utils/resume-utils';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ResumeUploaderProps {
  onUploadSuccess: (data: { fileUrl: string, resumeText: string }) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'idle' | 'uploading' | 'extracting'>('idle');
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      setIsUploading(true);
      setProcessingStage('uploading');
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setProcessingStage('extracting');
          }
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 150);
      
      try {
        const data = await handleResumeUpload(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        onUploadSuccess(data);
        toast({
          title: "Upload successful!",
          description: "Preparing to roast your resume...",
        });
      } catch (error) {
        clearInterval(progressInterval);
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setProcessingStage('idle');
        setUploadProgress(0);
      }
    },
    [onUploadSuccess, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-roast-primary ${
          isDragActive ? 'border-roast-primary bg-roast-primary/5' : 'border-gray-300'
        } ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        {!isUploading ? (
          <>
            <Upload 
              className={`h-12 w-12 mb-4 ${
                isDragActive ? 'text-roast-primary animate-bounce-subtle' : 'text-roast-secondary'
              }`}
            />
            <p className="text-center mb-2 text-lg font-medium">
              {isDragActive
                ? "Drop your resume here..."
                : "Drag & drop your resume here"}
            </p>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Only PDF files are supported (max 5MB)
            </p>
            <Button 
              variant="secondary" 
              className="bg-roast-secondary hover:bg-roast-primary"
            >
              Select resume
            </Button>
          </>
        ) : (
          <div className="w-full space-y-4">
            {processingStage === 'uploading' && (
              <>
                <FileText className="h-12 w-12 mx-auto mb-4 text-roast-primary animate-pulse" />
                <p className="text-center text-lg font-medium">Uploading resume...</p>
              </>
            )}
            
            {processingStage === 'extracting' && (
              <>
                <FileText className="h-12 w-12 mx-auto mb-4 text-roast-primary animate-pulse" />
                <p className="text-center text-lg font-medium">Extracting resume content...</p>
              </>
            )}
            
            <Progress value={uploadProgress} className="h-2 w-full bg-gray-200" />
            <p className="text-center text-sm text-muted-foreground">
              {uploadProgress}% {processingStage === 'uploading' ? 'uploaded' : 'processed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;
