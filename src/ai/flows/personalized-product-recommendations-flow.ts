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
  prompt: `You are an AI-powered product recommendation engine for NexaMart. Your goal is to suggest highly relevant products to the user based on their past activity and profile, considering popular e-commerce trends. Provide 5 recommendations.

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

Based on this information and popular e-commerce trends, suggest 5 highly relevant products. For each product, include a unique ID (a simple string like "P1", "P2"), a name, a concise description, a category (choose from "Electronics", "Fashion", "Home & Living", "Beauty", or suggest a new relevant one), a price (as a number), and an imageUrl (a placeholder URL like "https://placehold.co/150x150?text=Product+ID").

Ensure the output is a JSON array of product objects, adhering strictly to the provided output schema.
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
        const isTransient = error.message?.includes('503') || error.message?.includes('high demand');
        
        if (attempts >= maxAttempts || !isTransient) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
      }
    }
    throw new Error('Failed to generate recommendations after multiple attempts.');
  }
);
