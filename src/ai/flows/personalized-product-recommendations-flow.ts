'use server';
/**
 * @fileOverview An AI agent for generating personalized product recommendations.
 *
 * - personalizedProductRecommendations - A function that handles the product recommendation process.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  browsingHistory: z.array(z.string()).describe('A list of product names or descriptions the user has recently viewed.'),
  userProfile: z.object({
    fullName: z.string().describe("The user's full name."),
    city: z.string().describe("The user's city."),
  }).describe('Relevant user profile information.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.object({
    id: z.string().describe('A unique identifier for the product.'),
    name: z.string().describe('The name of the recommended product.'),
    description: z.string().describe('A short description of the product.'),
    category: z.string().describe('The category of the product (e.g., Electronics, Fashion, Home & Living, Beauty).'),
    price: z.number().describe('The price of the product.'),
    imageUrl: z.string().url().describe('A URL to an image of the product.'),
  })).describe('A list of personalized product recommendations.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function personalizedProductRecommendations(input: PersonalizedProductRecommendationsInput): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an AI-powered product recommendation engine for NexaMart. Your goal is to suggest highly relevant products to the user based on their past activity and profile.

User Profile:
Full Name: {{{userProfile.fullName}}}
City: {{{userProfile.city}}}

User Browsing History:
{{#if browsingHistory}}
{{#each browsingHistory}}- Product: {{{this}}} 
{{/each}}
{{else}}
No recent browsing history available.
{{/if}}

Based on this information, suggest 5 highly relevant products. 

CRITICAL INSTRUCTIONS:
1. Provide exactly 5 recommendations.
2. For each product, provide a unique ID, name, concise description, category, numeric price, and a valid URL for imageUrl.
3. Use placeholder image URLs in the format: https://placehold.co/400x400?text=Product+Name
4. Ensure the output is a pure JSON object matching the schema exactly. DO NOT include any markdown formatting, trailing characters, or extra text outside the JSON.
`,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        attempts++;
        
        // Retry on 503 (High Demand) or INVALID_ARGUMENT (Schema Validation Failure)
        const isRetryable = 
          error.message?.includes('503') || 
          error.message?.includes('high demand') ||
          error.message?.includes('INVALID_ARGUMENT') ||
          error.message?.includes('Schema validation failed');
        
        if (attempts >= maxAttempts || !isRetryable) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
      }
    }
    throw new Error('Failed to generate recommendations after multiple attempts.');
  }
);
