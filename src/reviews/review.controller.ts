import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('test-db')
  async testDb() {
    return this.reviewService.testDbConnection();
  }

  @Post()
  @ApiOperation({ summary: 'post new review' })
  @ApiBody({ 
    type: CreateReviewDto,
    examples: {
      'example input': {
        value: {
          writer_id:'aa34a41e-f01d-4728-a853-f3789953ac7b',
          seller_id:'c290f1ee-6c54-4b01-90e6-d701748f0851',
          rating: 4,
          comment: 'Happy with service.'
        }
      },
    }
   })
  @ApiResponse({ status: 201, description: 'review created', type: Review })
  @ApiResponse({ status: 400, description: 'invalid input' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get('writer/:user_id')
  @ApiOperation({ summary: 'get reviews by specified user' })
  @ApiParam({ name: 'user_id', example: 'c290f1ee-6c54-4b01-90e6-d701748f0851' })
  @ApiResponse({ 
    status: 200, 
    description: 'reviews retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          writer_id: { type: 'string', format: 'uuid' },
          latest_update: { type: 'string', format: 'date-time' },
          rating: { type: 'integer', minimum: 0, maximum: 5 },
          comment: { type: 'string', nullable: true }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'review not found' })
  async getByUser(@Param('user_id') userId: string) {
    return this.reviewService.findBySellerId(userId);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'get reviews for specified user' })
  @ApiParam({ name: 'user_id', example: 'c290f1ee-6c54-4b01-90e6-d701748f0851' })
  @ApiResponse({ 
    status: 200, 
    description: 'reviews retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          writer_id: { type: 'string', format: 'uuid' },
          latest_update: { type: 'string', format: 'date-time' },
          rating: { type: 'integer', minimum: 0, maximum: 5 },
          comment: { type: 'string', nullable: true }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'review not found' })
  async getByWriter(@Param('user_id') userId: string) {
    return this.reviewService.findByWriterId(userId);
  }

  @Patch(':review_id')
  @ApiOperation({ summary: 'update a review' })
  @ApiParam({ name: 'review_id', example: 'a290f1ee-6c54-4b01-90e6-d701748f0851' })
  @ApiBody({ 
    type: UpdateReviewDto,
    examples: {
      'example input': {
        value: {
          rating: 4,
          comment: 'Happy with service.'
        }
      },
    }
  })
  @ApiResponse({ status: 200, description: 'review updated', type: Review })
  @ApiResponse({ status: 404, description: 'review not found' })
  async update(@Param('review_id') reviewId: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(reviewId, updateReviewDto);
  }

  @Delete(':review_id')
  @ApiOperation({ summary: 'delete review' })
  @ApiParam({ name: 'review_id', example: 'a290f1ee-6c54-4b01-90e6-d701748f0851' })
  @ApiResponse({ status: 200, description: 'review deleted' })
  @ApiResponse({ status: 404, description: 'review not found' })
  async delete(@Param('review_id') reviewId: string): Promise<void> {
    return this.reviewService.delete(reviewId);
  }
}