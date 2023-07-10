import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserDetailEntity } from './user-detail.entity';
import { OfficeEntity } from './office.entity';

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

  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @Column({ name: 'device_name', nullable: true })
  deviceName: string;

  @Column({ name: 'platform', nullable: true })
  platform: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date;

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

  @OneToOne(() => OfficeEntity, (userOffice) => userOffice.user)
  userOffice: OfficeEntity;
}
