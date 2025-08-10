/**
 * Gemini API Client Utilities
 * Provides low-level API client functions for direct Gemini API integration
 * Used as a backup or alternative to the higher-level service layer
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAPIClient {
  constructor() {
    this.apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.client = null;
    
    if (this.apiKey && this.apiKey !== 'your-gemini-api-key-here') {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Check if API client is properly configured
   */
  isConfigured() {
    return this.client !== null;
  }

  /**
   * Get available models
   */
  async listModels() {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    try {
      // Note: Model listing might not be available in client-side SDK
      // This is a conceptual implementation
      return [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro',
        'gemini-pro-vision'
      ];
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  /**
   * Raw text generation with custom parameters
   */
  async generateText(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const {
      model = 'gemini-1.5-flash',
      temperature = 0.7,
      maxOutputTokens = 1000,
      topP = 0.8,
      topK = 40
    } = options;

    try {
      const genModel = this.client?.getGenerativeModel({ 
        model,
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP,
          topK
        }
      });

      const result = await genModel?.generateContent(prompt);
      const response = await result?.response;
      return {
        text: response?.text(),
        model: model,
        finishReason: response?.candidates?.[0]?.finishReason || 'STOP',
        safetyRatings: response?.candidates?.[0]?.safetyRatings || []
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }

  /**
   * Streaming text generation
   */
  async *generateTextStream(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const {
      model = 'gemini-1.5-flash',
      temperature = 0.7,
      maxOutputTokens = 1000
    } = options;

    try {
      const genModel = this.client?.getGenerativeModel({ 
        model,
        generationConfig: {
          temperature,
          maxOutputTokens
        }
      });

      const result = await genModel?.generateContentStream(prompt);

      for await (const chunk of result?.stream) {
        const text = chunk?.text();
        if (text) {
          yield {
            text,
            chunk: true,
            model: model
          };
        }
      }

      // Final response with complete data
      const response = await result?.response;
      yield {
        text: response?.text(),
        chunk: false,
        model: model,
        finishReason: response?.candidates?.[0]?.finishReason || 'STOP',
        complete: true
      };
    } catch (error) {
      console.error('Error streaming text:', error);
      throw error;
    }
  }

  /**
   * Multimodal generation with image input
   */
  async generateFromImageAndText(prompt, imageFile, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const { model = 'gemini-1.5-pro' } = options;

    try {
      // Convert image to base64
      const imageBase64 = await this.fileToBase64(imageFile);
      
      const genModel = this.client?.getGenerativeModel({ model });
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: imageFile?.type
        }
      };

      const result = await genModel?.generateContent([prompt, imagePart]);
      const response = await result?.response;

      return {
        text: response?.text(),
        model: model,
        finishReason: response?.candidates?.[0]?.finishReason || 'STOP'
      };
    } catch (error) {
      console.error('Error generating from image and text:', error);
      throw error;
    }
  }

  /**
   * Function calling implementation
   */
  async generateWithFunctions(prompt, functions, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const { model = 'gemini-1.5-pro' } = options;

    try {
      const tools = [{
        functionDeclarations: functions
      }];

      const genModel = this.client?.getGenerativeModel({
        model,
        tools
      });

      const result = await genModel?.generateContent(prompt);
      const response = await result?.response;
      const content = response?.candidates?.[0]?.content;

      if (content?.parts?.[0]?.functionCall) {
        return {
          type: 'function_call',
          functionCall: content?.parts?.[0]?.functionCall,
          model: model
        };
      }

      return {
        type: 'text',
        text: content?.parts?.[0]?.text,
        model: model
      };
    } catch (error) {
      console.error('Error with function calling:', error);
      throw error;
    }
  }

  /**
   * Chat session with history
   */
  async createChatSession(history = [], options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const { model = 'gemini-1.5-flash' } = options;

    try {
      const genModel = this.client?.getGenerativeModel({ model });
      const chat = genModel?.startChat({ history });

      return {
        async sendMessage(message) {
          const result = await chat?.sendMessage(message);
          const response = await result?.response;
          return {
            text: response?.text(),
            model: model,
            history: chat?.getHistory ? await chat?.getHistory() : null
          };
        },
        
        async sendMessageStream(message) {
          const result = await chat?.sendMessageStream(message);
          return result?.stream;
        }
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Safety settings configuration
   */
  getSafetySettings(level = 'BLOCK_MEDIUM_AND_ABOVE') {
    return [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: level
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: level
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: level
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: level
      }
    ];
  }

  /**
   * Utility function to convert file to base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Token counting (conceptual - actual implementation may vary)
   */
  async countTokens(text, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API client not configured');
    }

    const { model = 'gemini-1.5-flash' } = options;

    try {
      // Note: Actual token counting API might be different
      // This is a rough estimation based on text length
      const roughTokenCount = Math.ceil(text?.length / 4); // Rough approximation
      
      return {
        tokenCount: roughTokenCount,
        model: model,
        estimated: true
      };
    } catch (error) {
      console.error('Error counting tokens:', error);
      throw error;
    }
  }

  /**
   * Error handling helper
   */
  handleError(error) {
    if (error?.status) {
      switch (error?.status) {
        case 400:
          return new Error('Bad Request - Invalid parameters or prompt');
        case 401:
          return new Error('Unauthorized - Invalid API key');
        case 403:
          return new Error('Forbidden - API key lacks required permissions');
        case 429:
          return new Error('Rate Limit Exceeded - Too many requests');
        case 500:
          return new Error('Internal Server Error - Service temporarily unavailable');
        default:
          return new Error(`API Error ${error.status}: ${error.message}`);
      }
    }
    return error;
  }
}

// Create singleton instance
const geminiAPIClient = new GeminiAPIClient();

export default geminiAPIClient;

// Export utility functions
export const {
  isConfigured,
  generateText,
  generateTextStream,
  generateFromImageAndText,
  generateWithFunctions,
  createChatSession,
  getSafetySettings,
  fileToBase64,
  countTokens,
  handleError
} = geminiAPIClient;