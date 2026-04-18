import express from 'express';
import { pgPool } from '../config/db.js';

const router = express.Router();

// Mock Document Retrieval matching the frontend Dashboard
router.get('/', async (req, res) => {
  try {
    // In a real scenario, this fetches from Postgres
    // const { rows } = await pgPool.query('SELECT * FROM documents ORDER BY created_at DESC');
    // res.json(rows);
    
    // Returning mock data for immediate API consumption
    res.json([
      { id: 1, code: 'QA-SOP-2024-001', title: 'Assembly Standard Operating Procedure', version: 'v2.3', status: 'Approved', department: 'Quality Assurance', owner: 'John Doe', expiry: '2025-01-01' },
      { id: 2, code: 'PROD-WI-2024-015', title: 'Welding Work Instruction', version: 'v1.0', status: 'Under Review', department: 'Production', owner: 'Mike Johnson', expiry: '2024-12-15' }
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.post('/upload', async (req, res) => {
  const { title, department, owner } = req.body;
  try {
    // Generate document code
    const docCode = `NEW-DOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    
    // Insert into Postgres (Mocked for now)
    // const query = 'INSERT INTO documents (document_code, title, department_id) VALUES ($1, $2, $3) RETURNING *';
    // const { rows } = await pgPool.query(query, [docCode, title, 'uuid-placeholder']);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: { code: docCode, title, status: 'Under Review', department, owner }
    });
  } catch (error) {
    res.status(500).json({ error: 'Document upload failed' });
  }
});

export default router;
