import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './reviews/review.module';

@Module({
  imports: [ReviewModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}