// backend/src/repositories/UserRepository.ts
import { executeQuery, executeModifyQuery } from '../config/mysql-database.js';
import { User } from '../models/mysql/User.js';

export class UserRepository {
  
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = true';
    const rows = await executeQuery<User>(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ? AND is_active = true';
    const rows = await executeQuery<User>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO users (username, email, password, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeModifyQuery(query, [
      userData.username,
      userData.email,
      userData.password,
      userData.role,
      userData.is_active
    ]);
    
    return result.insertId;
  }

  static async updateLastLogin(id: number): Promise<boolean> {
    const query = 'UPDATE users SET updated_at = NOW() WHERE id = ?';
    const result = await executeModifyQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    const query = 'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?';
    const result = await executeModifyQuery(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<User[]> {
    const query = 'SELECT id, username, email, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC';
    return await executeQuery<User>(query);
  }
}
