
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";

interface GeneratedImageProps {
  imageUrl: string | null;
  prompt: string;
  isLoading: boolean;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, prompt, isLoading }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `art-blossom-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 flex flex-col items-center space-y-4 h-full">
      <h2 className="text-2xl font-bold mb-2 gradient-text text-center">Your Creation</h2>
      
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-200">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-art-teal border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 animate-pulse-slow">Creating your masterpiece...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={prompt || "Generated image"} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", e);
              // Retry with a different URL format if needed
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('?retry=true')) {
                target.src = `${imageUrl}?retry=true`;
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Image className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-400">Enter a prompt and click Generate to create an image</p>
          </div>
        )}
      </div>
      
      {prompt && imageUrl && (
        <>
          <p className="text-sm text-gray-600 italic text-center">"{prompt}"</p>
          
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-art-blue hover:bg-blue-600"
            disabled={isLoading || !imageUrl}
          >
            <Download size={16} />
            Download Image
          </Button>
        </>
      )}
    </Card>
  );
};

export default GeneratedImage;
