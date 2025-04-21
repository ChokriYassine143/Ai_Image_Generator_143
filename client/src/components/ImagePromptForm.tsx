
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ImagePromptFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

const PROMPT_SUGGESTIONS = [
  "A futuristic city with flying cars and neon lights",
  "A serene landscape with mountains and a lake at sunset",
  "A magical forest with glowing mushrooms and fantasy creatures",
  "A cyberpunk portrait of a robot with human features",
  "An underwater scene with colorful coral reefs and exotic fish"
];

const ImagePromptForm: React.FC<ImagePromptFormProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    try {
      await onGenerate(prompt);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const usePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Card className="p-6 shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Create with AI</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-700">
            Describe the image you want to create
          </label>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to see..."
            className="text-base min-h-[100px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Need inspiration? Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => usePromptSuggestion(suggestion)}
                className="text-xs px-3 py-1 bg-art-light-teal text-art-dark-teal rounded-full hover:bg-art-teal hover:text-white transition-colors"
                disabled={isGenerating}
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-teal-gradient hover:opacity-90 transition-opacity"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </form>
    </Card>
  );
};

export default ImagePromptForm;
