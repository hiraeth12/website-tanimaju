// backend/src/repositories/UserRepository.ts
import { executeQuery, executeModifyQuery } from '../config/mysql-database.js';
import { User } from '../models/mysql/User.js';

export class UserRepository {
  
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = true AND (status = "approved" OR status IS NULL)';
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
      INSERT INTO users (username, email, password, role, status, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeModifyQuery(query, [
      userData.username,
      userData.email,
      userData.password,
      userData.role,
      userData.status || 'pending',
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
    const query = 'SELECT id, username, email, role, status, is_active, created_at, updated_at FROM users ORDER BY created_at DESC';
    return await executeQuery<User>(query);
  }

  static async findByStatus(statuses: string[]): Promise<User[]> {
    const placeholders = statuses.map(() => '?').join(',');
    const query = `SELECT id, username, email, role, status, is_active, created_at, updated_at FROM users WHERE status IN (${placeholders}) ORDER BY created_at DESC`;
    return await executeQuery<User>(query, statuses);
  }

  static async updateStatus(id: number, status: 'approved' | 'rejected'): Promise<boolean> {
    const query = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
    const result = await executeModifyQuery(query, [status, id]);
    return result.affectedRows > 0;
  }

  // ========== Session Management Methods ==========

  /**
   * Update user's session key and expiration time
   */
  static async updateSession(id: number, sessionKey: string, expirationDate: Date): Promise<boolean> {
    const query = `
      UPDATE users 
      SET session_key = ?, session_expired_at = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    const result = await executeModifyQuery(query, [sessionKey, expirationDate, id]);
    return result.affectedRows > 0;
  }

  /**
   * Clear user's session (logout)
   */
  static async clearSession(id: number): Promise<boolean> {
    const query = `
      UPDATE users 
      SET session_key = NULL, session_expired_at = NULL, updated_at = NOW() 
      WHERE id = ?
    `;
    const result = await executeModifyQuery(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Find user by session key
   */
  static async findBySessionKey(sessionKey: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE session_key = ? 
        AND is_active = true 
        AND (status = "approved" OR status IS NULL)
    `;
    const rows = await executeQuery<User>(query, [sessionKey]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Validate session key and check if it's not expired
   */
  static async validateSession(sessionKey: string): Promise<{ valid: boolean; user?: User; expired?: boolean }> {
    const user = await this.findBySessionKey(sessionKey);
    
    if (!user) {
      return { valid: false };
    }

    if (!user.session_expired_at) {
      return { valid: false };
    }

    const now = new Date();
    const expirationDate = new Date(user.session_expired_at);
    
    if (now >= expirationDate) {
      // Session expired - clear it
      await this.clearSession(user.id);
      return { valid: false, user, expired: true };
    }

    return { valid: true, user };
  }

  /**
   * Clear all expired sessions (cleanup job)
   */
  static async clearExpiredSessions(): Promise<number> {
    const query = `
      UPDATE users 
      SET session_key = NULL, session_expired_at = NULL, updated_at = NOW() 
      WHERE session_expired_at IS NOT NULL 
        AND session_expired_at < NOW()
    `;
    const result = await executeModifyQuery(query);
    return result.affectedRows;
  }
}
