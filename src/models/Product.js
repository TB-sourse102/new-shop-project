import pool from '../config/database.js';

export default class Product {
  // 获取推荐商品
  static async getRecommended(limit = 12) {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_recommended = ?
      ORDER BY p.created_at DESC
      LIMIT ?`, 
      [false, limit]
    );
    return rows.map(item => ({
    ...item,
    price: Number(item.price) // 二次转换确保数字类型
 //   main_image: item.main_image || '/images/default-product.png'
  }));
  }

  // 其他方法
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?', 
      [id]
    );
    return rows[0];
  }
}