export class Review {
  review_id: string;
  writer_id: string;
  seller_id: string;
  latest_update: Date;
  stars: number;
  comment?: string;
}