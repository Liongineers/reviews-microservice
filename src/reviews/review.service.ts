import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Client } from 'pg';

const TEST_USER = 'b290f1ee-6c54-4b01-90e6-d701748f0851';

@Injectable()
export class ReviewService {
  private reviews: Review[] = [];

  async testDbConnection() {
    const client = new Client({
      host: '/cloudsql/cloud-computing-473717:us-east1:cloudsql-reviews-db',
      user: 'postgres',
      password: 'Liongineer1!',
      database: 'reviewdb',
      port: 5432,
    });

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
  const client = new Client({
    host: '/cloudsql/cloud-computing-473717:us-east1:cloudsql-reviews-db',
    user: 'postgres',
    password: 'Liongineer1!',
    database: 'reviewdb',
    port: 5432,
  });

  try {
    await client.connect();
    
    // Insert into database
    const result = await client.query(
      `INSERT INTO reviews (writer_id, seller_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING review_id, writer_id, seller_id, rating, comment, created_at, updated_at`,
      [TEST_USER, createReviewDto.seller_id, createReviewDto.stars, createReviewDto.comment]
    );
    
    await client.end();
    
    // Return the created review
    const review = result.rows[0];
    return {
      review_id: review.review_id,
      seller_id: review.seller_id,
      stars: review.rating, // Map back to 'stars' for API
      comment: review.comment,
      latest_update: review.updated_at
    };
    
  } catch (error) {
    console.error('Database insert failed:', error);
    throw error;
  }
}

  async findBySellerId(sellerId: string): Promise<any[]> {
  const client = new Client({
    host: '/cloudsql/cloud-computing-473717:us-east1:cloudsql-reviews-db',
    user: 'postgres',
    password: 'Liongineer1!',
    database: 'reviewdb',
    port: 5432,
  });

  try {
    await client.connect();
    
    const result = await client.query(
      `SELECT writer_id, rating, comment, updated_at 
       FROM reviews WHERE seller_id = $1 
       ORDER BY updated_at DESC`,
      [sellerId]
    );
    
    await client.end();
    
    // Map database fields to API response format
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

  async findMine(): Promise<any[]> {
  const reviews = this.reviews.filter(review => review.writer_id === TEST_USER);
  
  return reviews.map(review => ({
    seller_id: review.seller_id,
    latest_update: review.latest_update.toISOString(),
    stars: review.stars,
    comment: review.comment,
  }));
  }

  async update(reviewId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = this.reviews.find(review => review.review_id === reviewId);
    
    if (!review) {
      throw new NotFoundException(`review not found`);
    }

    const reviewIndex = this.reviews.findIndex(review => review.review_id === reviewId);
    this.reviews[reviewIndex] = {
      ...this.reviews[reviewIndex],
      ...updateReviewDto,
      latest_update: new Date(),
    };

    return this.reviews[reviewIndex];
  }

  async delete(reviewId: string): Promise<void> {
    const review = this.reviews.find(review => review.review_id === reviewId);
  
    if (!review) {
      throw new NotFoundException(`review not found`);
    }

    const reviewIndex = this.reviews.findIndex(review => review.review_id === reviewId);
    this.reviews.splice(reviewIndex, 1);
  }
}