import express from 'express';
import { searchDocuments, summarizeDocument } from '../services/ai.js';

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  
  try {
    // In a real flow, you search documents, then pass the context to an LLM
    // const contextMatches = await searchDocuments(question);
    
    // Mock response for immediate use
    res.json({
      answer: "Based on the Assembly SOP (v2.3), safety goggles must be worn at all times near the welding station.",
      sources: [
        { code: "QA-SOP-2024-001", title: "Assembly Standard Operating Procedure", relevance: 0.95 }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Search failed. Ensure Pinecone and OpenAI keys are configured.' });
  }
});

router.post('/summarize/:docId', async (req, res) => {
  try {
    // Fetch doc text from DB/S3
    const mockText = "This procedure outlines the safe operation of the industrial laser cutter...";
    
    // const summary = await summarizeDocument(mockText);
    
    // Mock response
    res.json({
      summary: "This document defines the standard operating procedures for the industrial laser cutter, emphasizing mandatory PPE and emergency shutdown protocols.",
      entities: { equipment: ["laser cutter"], risks: ["burns", "eye damage"] }
    });
  } catch (error) {
    res.status(500).json({ error: 'Summarization failed.' });
  }
});

export default router;
