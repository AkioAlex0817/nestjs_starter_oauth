import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'email_verify_tokens' })
export class EmailVerifyTokensEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({})
  email: string;

  @Column({ name: 'code' })
  code: number;

  @Column({ name: 'expiry_date', type: 'timestamptz' })
  expiryDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;
}
