import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

export default class User {
  // 注册用户
  static async create({ username, email, password }) {
    const hashedPassword = await hashPassword(password);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return this.findById(result.insertId);
  }

  // 通过ID查找用户
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 通过用户名查找
  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // 更新用户信息
  static async update(id, data) {
    const validFields = {};
    ['username', 'email', 'phone', 'avatar_url'].forEach(field => {
      if (data[field] !== undefined) validFields[field] = data[field];
    });

    const [result] = await pool.query(
      'UPDATE users SET ? WHERE id = ?',
      [validFields, id]
    );
    return this.findById(id);
  }

  // 更新密码
  static async updatePassword(id, newPasswordHash) {
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, id]
    );
  }
}