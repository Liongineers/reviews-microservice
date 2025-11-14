import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {
    
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  stars?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
