import { useState, useCallback } from 'react';
import geminiService from '../services/geminiService';

/**
 * Custom React Hook for Gemini AI Integration
 * Provides easy-to-use AI capabilities with loading states and error handling
 */
export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(geminiService?.isAvailable());

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const generateSummary = useCallback(async (data, type = 'notes') => {
    if (!isAvailable) {
      throw new Error('Gemini AI service is not available. Please check your API key configuration.');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'notes':
          result = await geminiService?.generateQueryNotesSummary(data);
          break;
        case 'invoice':
          result = await geminiService?.generateInvoiceSummary(data);
          break;
        case 'business':
          result = await geminiService?.generateBusinessInsights(data);
          break;
        default:
          throw new Error(`Unknown summary type: ${type}`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to generate AI summary';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const generateResponseSuggestions = useCallback(async (query) => {
    if (!isAvailable) {
      throw new Error('Gemini AI service is not available. Please check your API key configuration.');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const suggestions = await geminiService?.generateQueryResponseSuggestions(query);
      return suggestions;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to generate response suggestions';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const analyzeSentiment = useCallback(async (text) => {
    if (!isAvailable) {
      throw new Error('Gemini AI service is not available. Please check your API key configuration.');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await geminiService?.analyzeSentiment(text);
      return analysis;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to analyze sentiment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  return {
    isLoading,
    error,
    isAvailable,
    resetError,
    generateSummary,
    generateResponseSuggestions,
    analyzeSentiment
  };
};

export default useGeminiAI;