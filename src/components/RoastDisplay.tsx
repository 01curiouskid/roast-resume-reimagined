import React, { useState } from 'react';
import { Share, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface RoastDisplayProps {
  roast: string;
  isExtraSpicy: boolean;
  onToggleSpice: (isExtraSpicy: boolean) => void;
  shareableLink: string;
  onRoastAgain: () => void;
}

const RoastDisplay: React.FC<RoastDisplayProps> = ({ 
  roast, 
  isExtraSpicy, 
  onToggleSpice,
  shareableLink,
  onRoastAgain
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends to see their reaction.",
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Split roast text to keep emojis at the end
  const splitRoastText = () => {
    // Find the position of the last emoji (if any)
    const emojiRegex = /[\p{Emoji}\u200d]+$/u;
    const match = roast.match(emojiRegex);
    
    if (match && match.index) {
      const textPart = roast.substring(0, match.index);
      const emojiPart = match[0];
      return { textPart, emojiPart };
    }
    
    return { textPart: roast, emojiPart: '' };
  };

  const { textPart, emojiPart } = splitRoastText();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Label htmlFor="spice-toggle" className={isExtraSpicy ? "text-roast-light" : "text-muted-foreground"}>
          Spicy
        </Label>
        <Switch
          id="spice-toggle"
          checked={isExtraSpicy}
          onCheckedChange={onToggleSpice}
          className={isExtraSpicy ? "bg-rose-500" : ""}
        />
        <Label htmlFor="spice-toggle" className={isExtraSpicy ? "text-rose-500 font-bold" : "text-muted-foreground"}>
          Extra Spicy 🔥
        </Label>
      </div>
      
      <div className="resume-card p-6 rounded-lg shadow-lg mb-8 border border-muted">
        <p className="text-xl leading-relaxed mb-1">
          {textPart}
          <span className="text-2xl ml-1">{emojiPart}</span>
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-roast-secondary hover:bg-roast-secondary/20"
          onClick={handleCopyLink}
        >
          <Share className="mr-2 h-4 w-4" />
          {isCopied ? "Copied!" : "Share the roast"}
        </Button>
        
        <Button 
          variant="default"
          className="w-full sm:w-auto bg-roast-primary hover:bg-roast-accent"
          onClick={onRoastAgain}
        >
          Roast again
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-6">
        This link will expire in 48 hours
      </p>
    </div>
  );
};

export default RoastDisplay;
