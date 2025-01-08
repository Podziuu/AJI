import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

interface Product {
    name: string;
    category: string;
    price: number;
    weight: number;
    description?: string;
}

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSeoDescription(product: Product): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: "system",
            content: `You are an SEO content generator. Your task is to create an SEO-optimized description for a product based on the provided details. 
            The description should be written in plain text format and include:
            - A compelling headline that grabs attention.
            - A concise introductory paragraph that includes the main keywords.
            - A list of features or benefits of the product in bullet points.
            - A closing paragraph with a call to action, encouraging users to learn more or purchase the product.
            
            Your descriptions should be engaging, well-structured, and use keywords naturally to improve search engine visibility while being user-friendly.`
          },
          {
            role: "user",
            content: `
              Product name: ${product.name}
              Category: ${product.category}
              Price: ${product.price}
              Weight: ${product.weight}
              Description: ${product.description || 'No description available.'}
            `,
          },
        ],
      });

      return response.choices[0]?.message?.content.trim() || '';
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate SEO description');
    }
  }
}