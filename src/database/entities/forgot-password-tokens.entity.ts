import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'forgot_password_tokens' })
export class ForgotPasswordTokensEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({})
  email: string;

  @Column({ name: 'code' })
  code: number;

  @Column({ name: 'verify_token' })
  verifyToken: string;

  @Column({ name: 'expiry_date', type: 'timestamptz' })
  expiryDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;
}
