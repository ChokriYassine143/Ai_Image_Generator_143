
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImagePromptForm from '@/components/ImagePromptForm';
import GeneratedImage from '@/components/GeneratedImage';
import { temporaryReplicateService } from '@/services/replicateApi';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async (newPrompt: string) => {
    setIsGenerating(true);
    setPrompt(newPrompt);
    
    try {
      // Call the temporary service - you'll replace this with your backend later
      const generatedImageUrl = await temporaryReplicateService.generateImage(newPrompt);
      setImageUrl(generatedImageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-art-light-purple/30">
      <Toaster />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Transform Your Ideas Into Art</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Describe your vision and watch as AI brings it to life with stunning detail and creativity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImagePromptForm 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">About ArtBlossom AI</h3>
                <p className="text-gray-600 mb-4">
                  ArtBlossom AI uses advanced AI models to create stunning images from text descriptions. 
                  Simply describe what you want to see, and our AI will generate a unique image based on your prompt.
                </p>
                <div className="bg-art-light-purple/50 p-4 rounded-lg">
                  <h4 className="font-medium text-art-dark-purple">Pro Tips:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                    <li>Be specific and detailed in your description</li>
                    <li>Include style preferences (e.g., "oil painting," "digital art")</li>
                    <li>Mention colors, lighting, and atmosphere</li>
                    <li>Use descriptive adjectives for better results</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <GeneratedImage 
                imageUrl={imageUrl}
                prompt={prompt}
                isLoading={isGenerating}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 mt-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>ArtBlossom AI - Create beautiful AI-generated images</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
