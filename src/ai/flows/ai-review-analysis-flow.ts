'use server';
/**
 * @fileOverview An AI agent that analyzes product reviews to provide a summary of sentiment, pros, and cons.
 *
 * - analyzeProductReviews - A function that handles the product review analysis process.
 * - ReviewAnalysisInput - The input type for the analyzeProductReviews function.
 * - ReviewAnalysisOutput - The return type for the analyzeProductReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewAnalysisInputSchema = z.object({
  productReviews: z
    .array(z.string())
    .describe('An array of product review strings to be analyzed.'),
});
export type ReviewAnalysisInput = z.infer<typeof ReviewAnalysisInputSchema>;

const ReviewAnalysisOutputSchema = z.object({
  overallSentimentSummary:
    z.string().describe('A concise summary of the overall customer sentiment based on the reviews.'),
  commonPros:
    z.array(z.string()).describe('A list of common advantages or positive points frequently mentioned in the reviews.'),
  commonCons:
    z.array(z.string()).describe('A list of common disadvantages or negative points frequently mentioned in the reviews.'),
});
export type ReviewAnalysisOutput = z.infer<typeof ReviewAnalysisOutputSchema>;

export async function analyzeProductReviews(
  input: ReviewAnalysisInput
): Promise<ReviewAnalysisOutput> {
  return aiReviewAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewAnalysisPrompt',
  input: {schema: ReviewAnalysisInputSchema},
  output: {schema: ReviewAnalysisOutputSchema},
  prompt: `You are an expert in analyzing product reviews. Your goal is to provide a concise summary of the overall customer sentiment, identify the most common pros, and the most common cons based on the provided product reviews.

Here are the product reviews:

{{#each productReviews}}
- {{{this}}}
{{/each}}

Based on these reviews, generate:
1. An overall sentiment summary.
2. A list of 3-5 common pros. If fewer than 3, list all that are available.
3. A list of 3-5 common cons. If fewer than 3, list all that are available.

Format your response as a JSON object with the following structure:
{
  "overallSentimentSummary": "string",
  "commonPros": ["string", "string", ...],
  "commonCons": ["string", "string", ...]
}
`,
});

const aiReviewAnalysisFlow = ai.defineFlow(
  {
    name: 'aiReviewAnalysisFlow',
    inputSchema: ReviewAnalysisInputSchema,
    outputSchema: ReviewAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
