// backend/src/repositories/PetaniRepository.ts
import { executeQuery, executeModifyQuery } from '../config/mysql-database.js';
import { Petani } from '../models/mysql/interfaces.js';

export class PetaniRepository {
  
  static async findAll(): Promise<Petani[]> {
    const query = 'SELECT * FROM petani ORDER BY created_at DESC';
    return await executeQuery(query);
  }

  static async findById(id: number): Promise<Petani | null> {
    const query = 'SELECT * FROM petani WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(petaniData: Omit<Petani, 'id'>): Promise<number> {
    const query = `
      INSERT INTO petani (nama, alamat, nomorKontak, foto)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await executeModifyQuery(query, [
      petaniData.nama,
      petaniData.alamat,
      petaniData.nomorKontak,
      petaniData.foto
    ]);
    
    return result.insertId;
  }

  static async update(id: number, petaniData: Partial<Petani>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(petaniData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE petani SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await executeModifyQuery(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM petani WHERE id = ?';
    const result = await executeModifyQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async search(searchTerm: string): Promise<Petani[]> {
    const query = `
      SELECT * FROM petani 
      WHERE nama LIKE ? OR alamat LIKE ?
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
  }
}
