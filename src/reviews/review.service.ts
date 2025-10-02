import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

const TEST_USER = 'b290f1ee-6c54-4b01-90e6-d701748f0851';

@Injectable()
export class ReviewService {
  private reviews: Review[] = [];

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review: Review = {
      review_id: randomUUID(),
      ...createReviewDto,
      writer_id: TEST_USER,
      latest_update: new Date(),
    };
    
    this.reviews.push(review);
    return review;
  }

  async findBySellerId(sellerId: string): Promise<any[]> {
  const reviews = this.reviews.filter(review => review.seller_id === sellerId);
  
  return reviews.map(review => ({
    writer_id: review.writer_id,
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