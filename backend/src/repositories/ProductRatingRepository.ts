// backend/src/repositories/ProductRatingRepository.ts
import { executeQuery, executeModifyQuery } from '../config/mysql-database.js';
import { ProductRating } from '../models/mysql/interfaces.js';

export class ProductRatingRepository {
  
  static async findByProductId(productId: number): Promise<ProductRating[]> {
    const query = 'SELECT * FROM product_ratings WHERE product_id = ? ORDER BY created_at DESC';
    return await executeQuery(query, [productId]);
  }

  static async findByUserAndProduct(productId: number, userIdentifier: string): Promise<ProductRating | null> {
    const query = 'SELECT * FROM product_ratings WHERE product_id = ? AND user_identifier = ?';
    const rows = await executeQuery(query, [productId, userIdentifier]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async upsertRating(productId: number, userIdentifier: string, rating: number): Promise<boolean> {
    // Validate rating range
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    const query = `
      INSERT INTO product_ratings (product_id, user_identifier, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP
    `;
    
    const result = await executeModifyQuery(query, [productId, userIdentifier, rating]);
    
    // Update product's average rating and total count
    if (result.affectedRows > 0) {
      await this.updateProductRatingStats(productId);
      return true;
    }
    
    return false;
  }

  static async updateProductRatingStats(productId: number): Promise<void> {
    const query = `
      UPDATE products 
      SET 
        average_rating = (
          SELECT COALESCE(AVG(rating), 0) 
          FROM product_ratings 
          WHERE product_id = ?
        ),
        total_ratings = (
          SELECT COUNT(*) 
          FROM product_ratings 
          WHERE product_id = ?
        )
      WHERE id = ?
    `;
    
    await executeModifyQuery(query, [productId, productId, productId]);
  }

  static async getAverageRating(productId: number): Promise<{ average: number; count: number }> {
    const query = `
      SELECT 
        COALESCE(AVG(rating), 0) as average,
        COUNT(*) as count
      FROM product_ratings 
      WHERE product_id = ?
    `;
    
    const rows = await executeQuery(query, [productId]);
    return {
      average: rows[0]?.average || 0,
      count: rows[0]?.count || 0
    };
  }

  static async deleteRating(productId: number, userIdentifier: string): Promise<boolean> {
    const query = 'DELETE FROM product_ratings WHERE product_id = ? AND user_identifier = ?';
    const result = await executeModifyQuery(query, [productId, userIdentifier]);
    
    if (result.affectedRows > 0) {
      await this.updateProductRatingStats(productId);
      return true;
    }
    
    return false;
  }

  static async getAllRatingsForProduct(productId: number): Promise<{
    ratings: ProductRating[];
    average: number;
    total: number;
    distribution: { [key: number]: number };
  }> {
    const ratings = await this.findByProductId(productId);
    const stats = await this.getAverageRating(productId);
    
    // Calculate distribution
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => {
      const rounded = Math.round(r.rating);
      if (rounded >= 1 && rounded <= 5) {
        distribution[rounded]++;
      }
    });
    
    return {
      ratings,
      average: stats.average,
      total: stats.count,
      distribution
    };
  }

  static async findByUserId(userId: string): Promise<Array<ProductRating & { product_title?: string; product_image?: string; product_price?: number }>> {
    const query = `
      SELECT 
        pr.*,
        p.title as product_title,
        p.imageSrc as product_image,
        p.price as product_price
      FROM product_ratings pr
      JOIN products p ON pr.product_id = p.id
      WHERE pr.user_identifier = ?
      ORDER BY pr.updated_at DESC
    `;
    return await executeQuery(query, [userId]);
  }
}
