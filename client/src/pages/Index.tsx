
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImagePromptForm from '@/components/ImagePromptForm';
import GeneratedImage from '@/components/GeneratedImage';
import { cloudflareAIService } from '@/services/replicateApi';
import { userImageService } from '@/services/userImageService';
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SavedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadUserImages();
    }
  }, [currentUser]);

  const loadUserImages = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const images = await userImageService.getUserImages(currentUser.uid);
      setSavedImages(images);
    } catch (error) {
      console.error("Error loading saved images:", error);
      toast.error("Failed to load your saved images");
    }
  };

  const handleGenerate = async (newPrompt: string) => {
    setIsGenerating(true);
    setPrompt(newPrompt);
    setActiveTab('create'); // Ensure we're on the create tab
    
    try {
      // Call the temporary service
      const generatedImageUrl = await cloudflareAIService.generateImage(newPrompt);
      
      if (!generatedImageUrl) {
        throw new Error("Failed to generate image URL");
      }

      setImageUrl(generatedImageUrl);
      
      // Save the generated image if user is logged in
    if (currentUser) {
        await userImageService.saveImage(currentUser.uid, newPrompt, generatedImageUrl);
        toast.success("Image saved to your gallery");
        await loadUserImages(); // Refresh the saved images
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-art-light-teal/30">
      <Toaster />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Transform Your Ideas Into Art</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Describe your vision and watch as AI brings it to life with stunning detail and creativity.
            </p>
          </div>
          
          <Tabs value={activeTab} defaultValue="create" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="gallery">My Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-0">
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
                    <div className="bg-art-light-teal/50 p-4 rounded-lg">
                      <h4 className="font-medium text-art-dark-teal">Pro Tips:</h4>
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
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-0">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Your Image Gallery</h3>
                
                {savedImages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-art-light-teal/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-art-teal">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium mb-2">No images yet</h4>
                    <p className="text-gray-600 mb-6">Generate your first image to start building your gallery</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-2 bg-teal-gradient text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                      Create your first image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {savedImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden group">
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={image.imageUrl} 
                            alt={image.prompt} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2 italic">"{image.prompt}"</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {image.createdAt.toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
