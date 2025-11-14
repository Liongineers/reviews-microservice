import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './entity/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      extra: {
        socketPath: '/cloudsql/cloud-computing-473717:us-east1:cloudsql-reviews-db',
      },
      username: 'postgres',
      password: 'Liongineer1!',
      database: 'reviewdb',
      entities: [Review],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Review]),
  ], 
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}