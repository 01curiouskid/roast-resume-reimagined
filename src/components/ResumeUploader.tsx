
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { handleResumeUpload } from '@/utils/resume-utils';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploaderProps {
  onUploadSuccess: (data: { fileUrl: string, resumeText: string }) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      setIsUploading(true);
      
      try {
        const data = await handleResumeUpload(file);
        onUploadSuccess(data);
        toast({
          title: "Upload successful!",
          description: "Preparing to roast your resume...",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
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
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`upload-drop-zone p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer ${
          isDragActive ? 'active' : ''
        }`}
      >
        <input {...getInputProps()} />
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
          disabled={isUploading}
          className="bg-roast-secondary hover:bg-roast-primary"
        >
          {isUploading ? "Uploading..." : "Select resume"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUploader;
