import { toast } from 'sonner';

interface PredictionResponse {
  imageUrl: string;
  error?: string;
}

export class CloudflareAIService {
  private readonly proxyUrl: string;

  constructor() {
    // Point to your proxy server
    this.proxyUrl = 'https://ai-image-generator-143.onrender.com/generate-image'; // Update with your proxy server URL in production
  }

  async generateImage(prompt: string): Promise<string> {
    toast.info('Starting image generation...');

    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data: PredictionResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      toast.success('Image generated successfully!');
      return data.imageUrl;
    } catch (error: Error) {
      toast.error(`Failed to generate image: ${error.message}`);
      throw error;
    }
  }
}

export const cloudflareAIService = new CloudflareAIService();