import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

const TEST_USER = 'b290f1ee-6c54-4b01-90e6-d701748f0851';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Check for duplicate review (writer_id + seller_id unique constraint)
    const existingReview = await this.reviewRepository.findOne({
      where: {
        writer_id: TEST_USER,
        seller_id: createReviewDto.seller_id,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this seller');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      writer_id: TEST_USER,
      // created_at and updated_at are automatically set by the database
    });
    
    return await this.reviewRepository.save(review);
  }

  async findBySellerId(sellerId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { seller_id: sellerId },
      order: { created_at: 'DESC' },
    });
  }

  async update(reviewId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    // updated_at will be automatically updated by the database
    const updatedReview = this.reviewRepository.merge(review, updateReviewDto);

    return await this.reviewRepository.save(updatedReview);
  }

  async delete(reviewId: string): Promise<void> {
    const result = await this.reviewRepository.delete(reviewId);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
  }

  // Optional: Get reviews written by current user
  async findMyReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { writer_id: TEST_USER },
      order: { created_at: 'DESC' },
    });
  }
}