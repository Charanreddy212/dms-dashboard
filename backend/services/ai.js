import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI and Pinecone only if keys are present to avoid crash on startup without keys
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const pinecone = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;

export const generateEmbedding = async (text) => {
  if (!openai) throw new Error("OpenAI is not configured.");
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return response.data[0].embedding;
};

export const searchDocuments = async (query) => {
  if (!pinecone || !openai) throw new Error("AI services are not fully configured.");
  
  // 1. Convert user query to vector
  const queryEmbedding = await generateEmbedding(query);
  
  // 2. Search Pinecone index
  const index = pinecone.index(process.env.PINECONE_INDEX || 'dms-documents');
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  return searchResults.matches;
};

export const summarizeDocument = async (documentText) => {
  if (!openai) throw new Error("OpenAI is not configured.");
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "You are an expert technical writer and compliance officer. Summarize the following document, extract key entities, and note any potential ISO compliance gaps." },
      { role: "user", content: documentText }
    ],
  });
  
  return response.choices[0].message.content;
};
