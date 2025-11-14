import { IsString, IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ format: 'uuid', example: 'c290f1ee-6c54-4b01-90e6-d701748f0851' })
  @IsUUID()
  seller_id: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;  // Changed from 'stars' to 'rating'

  @ApiPropertyOptional({ example: 'The sale with this user was satisfactory.' })
  @IsOptional()
  @IsString()
  comment?: string;
}