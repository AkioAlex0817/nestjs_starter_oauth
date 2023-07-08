import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserDetailEntity } from './user-detail.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @Column({ default: false })
  active: boolean;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'expiry_access_date', type: 'timestamptz', nullable: true })
  expiryAccessDate: Date;

  @Column({ name: 'expiry_refresh_date', type: 'timestamptz', nullable: true })
  expiryRefreshDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @OneToOne(() => UserDetailEntity, (userDetail) => userDetail.user)
  userDetail: UserDetailEntity;
}
