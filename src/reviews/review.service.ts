import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Client } from 'pg';

@Injectable()
export class ReviewService {
  //private reviews: Review[] = [];

  private getClient() {
    return new Client({
      host: '/cloudsql/cloud-computing-473717:us-east1:cloudsql-reviews-db',
      user: 'postgres', 
      password: 'Liongineer1!',
      database: 'reviewdb',
      port: 5432,
    });
  }

  async testDbConnection() {
    const client = this.getClient();
    try {
      await client.connect();
      const result = await client.query('SELECT NOW() as time');
      await client.end();
      
      console.log('✅ Database connection successful');
      return { connected: true, databaseTime: result.rows[0].time };
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
      return { connected: false, error: error.message };
    }
  }

  async create(createReviewDto: CreateReviewDto): Promise<any> {
    console.log('CREATE METHOD CALLED');
    const client = this.getClient();
    try {
      console.log('Connecting to database...');
      await client.connect();
      console.log('Database connected successfully');
      
      console.log('Executing INSERT query...');
      const result = await client.query(
        `INSERT INTO reviews (writer_id, seller_id, rating, comment) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`, 
        [createReviewDto.writer_id, createReviewDto.seller_id, createReviewDto.rating, createReviewDto.comment || null]
      );
      
      console.log('INSERT successful:', result.rows[0]);
      await client.end();
      
      const response = {
        review_id: result.rows[0].review_id,
        writer_id: result.rows[0].writer_id,
        seller_id: result.rows[0].seller_id,
        rating: result.rows[0].rating,
        comment: result.rows[0].comment,
        latest_update: result.rows[0].updated_at
      };
      
      console.log('Returning response:', response);
      return response;
        
    } catch (error) {
      await client.end();
      console.error('CREATE METHOD FAILED:', error);
      
      // Handle duplicate review constraint
      if (error.code === '23505' && error.constraint === 'reviews_writer_id_seller_id_key') {
        throw new ConflictException('You have already reviewed this seller. Please update your existing review instead.');
      }
      
      throw error;
    }
  }

  async findBySellerId(sellerId: string): Promise<any[]> {
    const client = this.getClient();
    try {
      await client.connect();
      
      const result = await client.query(
        `SELECT writer_id, rating, comment, updated_at 
        FROM reviews WHERE seller_id = $1 
        ORDER BY updated_at DESC`,
        [sellerId]
      );
      
      await client.end();
      
      return result.rows.map(row => ({
        writer_id: row.writer_id,
        latest_update: row.updated_at.toISOString(),
        stars: row.rating, // Map rating to stars
        comment: row.comment
      }));
      
    } catch (error) {
      console.error('Database query failed:', error);
      return [];
    }
  }

  async findByWriterId(writerId: string): Promise<any[]> {
    const client = this.getClient();
    try {
      await client.connect();
      
      const result = await client.query(
        `SELECT seller_id, rating, comment, updated_at 
        FROM reviews WHERE writer_id = $1 
        ORDER BY updated_at DESC`,
        [writerId]
      );
      
      await client.end();
      
      return result.rows.map(row => ({
        seller_id: row.seller_id,
        latest_update: row.updated_at.toISOString(),
        stars: row.rating,
        comment: row.comment
      }));
      
    } catch (error) {
      console.error('Database query failed:', error);
      return [];
    }
  }
  async update(reviewId: string, updateReviewDto: UpdateReviewDto): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();
      
      const checkResult = await client.query(
        'SELECT review_id FROM reviews WHERE review_id = $1',
        [reviewId]
      );
      
      if (checkResult.rows.length === 0) {
        throw new NotFoundException(`review not found`);
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (updateReviewDto.rating !== undefined) {
        updates.push(`rating = $${paramCount}`);
        values.push(updateReviewDto.rating);
        paramCount++;
      }
      
      if (updateReviewDto.comment !== undefined) {
        updates.push(`comment = $${paramCount}`);
        values.push(updateReviewDto.comment);
        paramCount++;
      }

      updates.push(`updated_at = NOW()`);
      values.push(reviewId);

      const result = await client.query(
        `UPDATE reviews SET ${updates.join(', ')} 
        WHERE review_id = $${paramCount} 
        RETURNING review_id, seller_id, rating, comment, updated_at`,
        values
      );
      
      await client.end();

      const review = result.rows[0];
      return {
        review_id: review.review_id,
        seller_id: review.seller_id,
        stars: review.rating,
        comment: review.comment,
        latest_update: review.updated_at
      };
      
    } catch (error) {
      console.error('Database update failed:', error);
    }
  }

  async delete(reviewId: string): Promise<void> {
    const client = this.getClient();
    try {
      await client.connect();
      
      const checkResult = await client.query(
        'SELECT review_id FROM reviews WHERE review_id = $1',
        [reviewId]
      );
      
      if (checkResult.rows.length === 0) {
        throw new NotFoundException(`review not found`);
      }

      await client.query(
        'DELETE FROM reviews WHERE review_id = $1',
        [reviewId]
      );
      
      await client.end();
      
    } catch (error) {
      console.error('Database delete failed:', error);
      if (error instanceof NotFoundException) throw error;
      throw new Error('Delete failed');
    }
  }
}