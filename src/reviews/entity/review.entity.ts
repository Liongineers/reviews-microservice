import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Review {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @Column('uuid')
  writer_id: string;

   @Column('uuid')
  seller_id: string;

  @Column({ type: 'smallint' })
  rating: number; 

  @Column({ type: 'varchar', length: 2000, nullable: true })
  comment: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}