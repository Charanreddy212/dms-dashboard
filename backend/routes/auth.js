import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded mock login for demo purposes
  if (email === 'admin@company.com' && password === 'Admin@123') {
    const token = jwt.sign(
      { id: 'uuid-1', role: 'Admin', department: 'IT' }, 
      process.env.JWT_SECRET || 'super-secret-key', 
      { expiresIn: '1h' }
    );
    
    return res.json({
      message: 'Login successful',
      token,
      user: { name: 'John Doe', email, role: 'Admin' }
    });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
