import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @Column('uuid')
  writer_id: string;

  @Column('uuid')
  seller_id: string;

  @Column('smallint')
  rating: number;

  @Column('varchar', { length: 2000, nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}