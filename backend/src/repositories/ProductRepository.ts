// backend/src/repositories/ProductRepository.ts
import { executeQuery } from '../config/mysql-database.js';
import { Product } from '../models/mysql/interfaces.js';

export class ProductRepository {
  
  static async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    return await executeQuery(query);
  }

  static async findById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(productData: Omit<Product, 'id'>): Promise<number> {
    const query = `
      INSERT INTO products (title, price, imageSrc, description, info, whatsappNumber)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      productData.title,
      productData.price,
      productData.imageSrc,
      productData.description,
      productData.info,
      productData.whatsappNumber
    ]);
    
    return result.insertId;
  }

  static async update(id: number, productData: Partial<Product>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await executeQuery(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async search(searchTerm: string): Promise<Product[]> {
    const query = `
      SELECT * FROM products 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
  }
}
