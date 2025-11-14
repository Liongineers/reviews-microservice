import { IsString, IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  
  @IsUUID()
  seller_id: string;

  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
