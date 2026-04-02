'use server';
/**
 * @fileOverview A Genkit flow that generates concise and engaging AI-generated summaries for products.
 *
 * - generateProductSummary - A function that generates an AI-powered product summary.
 * - ProductSummaryInput - The input type for the generateProductSummary function.
 * - ProductSummaryOutput - The return type for the generateProductSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSummaryInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productFeatures: z.array(z.string()).optional().describe('A list of key features of the product.'),
  productBenefits: z.array(z.string()).optional().describe('A list of benefits the product offers.'),
});
export type ProductSummaryInput = z.infer<typeof ProductSummaryInputSchema>;

const ProductSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise and engaging AI-generated summary of the product.'),
});
export type ProductSummaryOutput = z.infer<typeof ProductSummaryOutputSchema>;

export async function generateProductSummary(input: ProductSummaryInput): Promise<ProductSummaryOutput> {
  return productSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productSummaryPrompt',
  input: {schema: ProductSummaryInputSchema},
  output: {schema: ProductSummaryOutputSchema},
  prompt: `You are an expert copywriter specializing in e-commerce product descriptions.

Generate a concise and engaging summary for the product based on the provided details. Highlight its key features and benefits to quickly convey its value to potential customers.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}

{{#if productFeatures}}
Key Features:
{{#each productFeatures}}- {{{this}}}
{{/each}}
{{/if}}

{{#if productBenefits}}
Benefits:
{{#each productBenefits}}- {{{this}}}
{{/each}}
{{/if}}

Your summary should be no more than 3-4 sentences long, focusing on impact and clarity.`,
});

const productSummaryFlow = ai.defineFlow(
  {
    name: 'productSummaryFlow',
    inputSchema: ProductSummaryInputSchema,
    outputSchema: ProductSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  },
);
