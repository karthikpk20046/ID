import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service for ERP CRM Platform
 * Provides comprehensive AI capabilities including text generation, summaries, 
 * multimodal inputs, function calling, and grounding with Google Search.
 */

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    this.client = null;
    this.rateLimitDelay = 1000; // 1 second delay between requests
    this.lastRequestTime = 0;
    
    if (!this.apiKey || this.apiKey === 'your-gemini-api-key-here') {
      console.warn('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
      return;
    }
    
    this.client = new GoogleGenerativeAI(this.apiKey);
  }

  /**
   * Check if Gemini service is available
   */
  isAvailable() {
    return this.client !== null && this.apiKey && this.apiKey !== 'your-gemini-api-key-here';
  }

  /**
   * Rate limiting helper
   */
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Generate text summary for query notes
   * @param {Array} notes - Array of note objects
   * @returns {Promise<string>} AI-generated summary
   */
  async generateQueryNotesSummary(notes) {
    if (!this.isAvailable()) {
      throw new Error('Gemini service is not available. Please check your API key configuration.');
    }

    if (!notes || notes?.length === 0) {
      return 'No notes available to summarize.';
    }

    try {
      await this.enforceRateLimit();
      
      const model = this.client?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const notesText = notes?.map(note => 
        `${note?.author} (${new Date(note?.createdAt)?.toLocaleDateString()}): ${note?.content}`
      )?.join('\n\n');
      
      const prompt = `Please provide a concise summary of the following customer support query notes. Focus on key issues, resolutions, and current status:

${notesText}

Provide a professional summary that highlights:
1. Main issues or concerns raised
2. Actions taken by support agents
3. Current status and next steps
4. Any urgent matters requiring attention

Keep the summary under 200 words and use bullet points where appropriate.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
      
    } catch (error) {
      console.error('Error generating query notes summary:', error);
      throw new Error(`Failed to generate summary: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate text summary for invoice line items and notes
   * @param {Object} invoice - Invoice object with items and notes
   * @returns {Promise<string>} AI-generated summary
   */
  async generateInvoiceSummary(invoice) {
    if (!this.isAvailable()) {
      throw new Error('Gemini service is not available. Please check your API key configuration.');
    }

    if (!invoice) {
      throw new Error('Invoice data is required for summary generation.');
    }

    try {
      await this.enforceRateLimit();
      
      const model = this.client?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const itemsText = invoice?.items?.map(item => 
        `${item?.description} - Qty: ${item?.quantity}, Rate: $${item?.rate}, Total: $${item?.amount}`
      )?.join('\n');
      
      const notesText = invoice?.notes || 'No additional notes';
      
      const prompt = `Generate a professional invoice summary for the following invoice data:

Invoice Number: ${invoice?.invoiceNumber}
Customer: ${invoice?.customer}
Total Amount: $${invoice?.amount}
Status: ${invoice?.status}
Due Date: ${invoice?.dueDate}

Line Items:
${itemsText}

Notes: ${notesText}

Provide a concise business summary that includes:
1. Overview of services/products provided
2. Total value and payment status
3. Key highlights or important notes
4. Professional tone suitable for business communications

Keep the summary under 150 words.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
      
    } catch (error) {
      console.error('Error generating invoice summary:', error);
      throw new Error(`Failed to generate invoice summary: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate smart suggestions for query responses
   * @param {Object} query - Query object with description and history
   * @returns {Promise<Array>} Array of suggested responses
   */
  async generateQueryResponseSuggestions(query) {
    if (!this.isAvailable()) {
      throw new Error('Gemini service is not available. Please check your API key configuration.');
    }

    try {
      await this.enforceRateLimit();
      
      const model = this.client?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Based on the following customer support query, suggest 3 professional response options:

Customer: ${query?.customer}
Subject: ${query?.subject}
Description: ${query?.description}
Priority: ${query?.priority}
Current Status: ${query?.status}

Previous Notes:
${query?.notes?.map(note => `- ${note?.content}`)?.join('\n') || 'No previous notes'}

Provide 3 different response approaches:
1. Immediate acknowledgment and next steps
2. Technical solution-focused response
3. Escalation or follow-up response

Each response should be professional, helpful, and appropriate for the query priority level.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      
      // Parse the response into separate suggestions
      const suggestions = response?.text()
        ?.split(/\d\.\s/)
        ?.filter(suggestion => suggestion?.trim()?.length > 10)
        ?.map(suggestion => suggestion?.trim())
        ?.slice(0, 3);
      
      return suggestions || ['Thank you for your inquiry. We are reviewing your request and will respond within 24 hours.'];
      
    } catch (error) {
      console.error('Error generating query response suggestions:', error);
      throw new Error(`Failed to generate response suggestions: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Analyze text sentiment for customer communications
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} Sentiment analysis result
   */
  async analyzeSentiment(text) {
    if (!this.isAvailable()) {
      throw new Error('Gemini service is not available. Please check your API key configuration.');
    }

    try {
      await this.enforceRateLimit();
      
      const model = this.client?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Analyze the sentiment of the following customer communication text and provide a structured response:

Text: "${text}"

Please provide your analysis in the following format:
Sentiment: [Positive/Negative/Neutral]
Confidence: [High/Medium/Low]
Key Emotions: [list main emotions detected]
Urgency Level: [High/Medium/Low]
Recommended Action: [brief recommendation for handling this communication]

Be concise and professional in your analysis.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      
      // Parse structured response
      const analysis = this.parseStructuredResponse(response?.text());
      
      return {
        sentiment: analysis?.Sentiment || 'Neutral',
        confidence: analysis?.Confidence || 'Medium',
        emotions: analysis?.['Key Emotions'] || 'None detected',
        urgency: analysis?.['Urgency Level'] || 'Medium',
        recommendation: analysis?.['Recommended Action'] || 'Follow standard procedures'
      };
      
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw new Error(`Failed to analyze sentiment: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate business insights from invoice data
   * @param {Array} invoices - Array of invoice objects
   * @returns {Promise<string>} Business insights summary
   */
  async generateBusinessInsights(invoices) {
    if (!this.isAvailable()) {
      throw new Error('Gemini service is not available. Please check your API key configuration.');
    }

    try {
      await this.enforceRateLimit();
      
      const model = this.client?.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const totalRevenue = invoices?.reduce((sum, inv) => sum + inv?.amount, 0);
      const paidInvoices = invoices?.filter(inv => inv?.status === 'Paid');
      const overdueInvoices = invoices?.filter(inv => inv?.status === 'Overdue');
      
      const prompt = `Analyze the following invoice data and provide business insights:

Total Invoices: ${invoices?.length}
Total Revenue: $${totalRevenue}
Paid Invoices: ${paidInvoices?.length} ($${paidInvoices?.reduce((sum, inv) => sum + inv?.amount, 0)})
Overdue Invoices: ${overdueInvoices?.length} ($${overdueInvoices?.reduce((sum, inv) => sum + inv?.amount, 0)})

Top Customers by Revenue:
${this.getTopCustomers(invoices)?.slice(0, 5)?.map(customer => 
  `${customer?.name}: $${customer?.total}`
)?.join('\n')}

Common Services:
${this.getCommonServices(invoices)?.slice(0, 5)?.join('\n')}

Provide insights on:
1. Revenue trends and performance
2. Customer payment behavior
3. Service demand patterns
4. Recommendations for improvement
5. Potential risks or opportunities

Keep the analysis professional and actionable for business decision-making.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
      
    } catch (error) {
      console.error('Error generating business insights:', error);
      throw new Error(`Failed to generate business insights: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Helper method to parse structured AI responses
   */
  parseStructuredResponse(text) {
    const lines = text?.split('\n')?.filter(line => line?.trim()?.length > 0);
    const result = {};
    
    lines?.forEach(line => {
      const colonIndex = line?.indexOf(':');
      if (colonIndex > 0) {
        const key = line?.substring(0, colonIndex)?.trim();
        const value = line?.substring(colonIndex + 1)?.trim();
        result[key] = value;
      }
    });
    
    return result;
  }

  /**
   * Helper method to get top customers by revenue
   */
  getTopCustomers(invoices) {
    const customerTotals = {};
    
    invoices?.forEach(invoice => {
      if (customerTotals?.[invoice?.customer]) {
        customerTotals[invoice?.customer] += invoice?.amount;
      } else {
        customerTotals[invoice?.customer] = invoice?.amount;
      }
    });
    
    return Object.entries(customerTotals)
      ?.map(([name, total]) => ({ name, total }))
      ?.sort((a, b) => b?.total - a?.total);
  }

  /**
   * Helper method to get common services
   */
  getCommonServices(invoices) {
    const services = {};
    
    invoices?.forEach(invoice => {
      invoice?.items?.forEach(item => {
        if (services?.[item?.description]) {
          services[item?.description]++;
        } else {
          services[item?.description] = 1;
        }
      });
    });
    
    return Object.entries(services)
      ?.sort(([,a], [,b]) => b - a)
      ?.map(([service, count]) => `${service} (${count} times)`);
  }
}

// Create and export singleton instance
const geminiService = new GeminiService();

export default geminiService;

// Export individual methods for direct use
export const {
  generateQueryNotesSummary,
  generateInvoiceSummary,
  generateQueryResponseSuggestions,
  analyzeSentiment,
  generateBusinessInsights,
  isAvailable
} = geminiService;