import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Client } from 'pg';

const TEST_USER = 'b290f1ee-6c54-4b01-90e6-d701748f0851';

@Injectable()
export class ReviewService {
  private reviews: Review[] = [];
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

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

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review: Review = {
      review_id: randomUUID(),
      writer_id: TEST_USER,
      seller_id: createReviewDto.seller_id,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment || null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    this.reviews.push(review);
    return review;
  }

  async findBySellerId(sellerId: string): Promise<any[]> {
  const reviews = this.reviews.filter(review => review.seller_id === sellerId);
  
  return reviews.map(review => ({
    writer_id: review.writer_id,
    updated_at: review.updated_at.toISOString(),
    rating: review.rating,
    comment: review.comment,
  }));
  }

  async findMine(): Promise<any[]> {
  const reviews = this.reviews.filter(review => review.writer_id === TEST_USER);
  
  return reviews.map(review => ({
    seller_id: review.seller_id,
    updated_at: review.updated_at.toISOString(),
    rating: review.rating,
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
      updated_at: new Date(),
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