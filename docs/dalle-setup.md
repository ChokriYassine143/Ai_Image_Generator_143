
# DALL-E API Integration Guide

## Prerequisites
1. Create an OpenAI account at [OpenAI Platform](https://platform.openai.com)
2. Get your API key from the [API Keys section](https://platform.openai.com/api-keys)
3. Keep track of your API usage in the [Usage section](https://platform.openai.com/usage)

## Configuration Steps

### 1. API Key Setup
If using Supabase (recommended):
1. Add your OpenAI API key to Supabase Edge Function Secrets
2. Access it securely in your Edge Functions

If not using Supabase (temporary solution):
1. Create a secure input for users to enter their API key
2. Store it temporarily in memory (not localStorage for security)

### 2. API Integration

Example API call structure:

```typescript
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "dall-e-3", // or "dall-e-2" for the older model
    prompt: userPrompt,
    n: 1, // Number of images to generate
    size: "1024x1024", // Available sizes: 1024x1024, 512x512, 256x256
    quality: "standard", // "standard" or "hd" for DALL-E 3
    style: "vivid", // "vivid" or "natural" for DALL-E 3
  }),
});

const data = await response.json();
```

### 3. Recommended Implementation

```typescript
export class DallEService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate image');
      }

      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}
```

## Usage Examples

### Basic Implementation
```typescript
const dalleService = new DallEService(apiKey);

try {
  const imageUrl = await dalleService.generateImage("A serene mountain landscape at sunset");
  console.log('Generated image URL:', imageUrl);
} catch (error) {
  console.error('Failed to generate image:', error);
}
```

## Error Handling

Common errors and solutions:

1. **Authentication Error**
   - Verify API key is valid and correctly formatted
   - Check if API key has sufficient permissions
   - Ensure API key is not expired

2. **Rate Limiting**
   - Implement retry logic with exponential backoff
   - Monitor API usage limits
   - Consider implementing request queuing

3. **Content Filtering**
   - Review prompt guidelines
   - Implement proper content filtering
   - Handle rejected prompts gracefully

## Best Practices

1. **Security**
   - Never expose API keys in client-side code
   - Use environment variables or secure storage
   - Implement proper request validation

2. **Performance**
   - Cache generated images when possible
   - Implement loading states
   - Handle timeouts appropriately

3. **User Experience**
   - Provide clear feedback during generation
   - Implement proper error messages
   - Show loading indicators

4. **Cost Management**
   - Monitor API usage
   - Implement usage limits
   - Consider implementing user quotas

## Rate Limits and Quotas

- Monitor your usage in the OpenAI dashboard
- Implement proper error handling for rate limits
- Consider implementing a queue system for high-traffic applications

## Alternative Approaches

1. **Server-side Implementation**
   - Recommended for production applications
   - Better security for API keys
   - More control over rate limiting

2. **Batch Processing**
   - Useful for generating multiple images
   - Can help manage costs
   - Better handling of rate limits

3. **Hybrid Approach**
   - Combine client and server-side processing
   - Balance between performance and security
   - More flexible scaling options

