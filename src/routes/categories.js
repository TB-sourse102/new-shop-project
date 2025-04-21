import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// 获取顶级分类
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT * FROM categories 
      WHERE parent_id IS NULL
      ORDER BY name ASC
    `);
    
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;