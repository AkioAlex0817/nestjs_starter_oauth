import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ProvinceEntity } from './province.entity';
import { DistrictEntity } from './district.entity';
import { LlgEntity } from './llg.entity';
import { WardEntity } from './ward.entity';

@Entity({ name: 'office_infos' })
export class OfficeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'province_id', type: 'bigint', nullable: true })
  provinceId: number;

  @Column({ name: 'district_id', type: 'bigint', nullable: true })
  districtId: number;

  @Column({ name: 'llg_id', type: 'bigint', nullable: true })
  llgId: number;

  @Column({ name: 'ward_id', type: 'bigint', nullable: true })
  wardId: number;

  @Column({ name: 'registration_point', nullable: true })
  registrationPoint: string;

  @Column({ name: 'registration_office_name', nullable: true })
  registrationOfficeName: string;

  @Column({ name: 'nid_no', nullable: true })
  NIDNo: string;

  @Column({ name: 'card_url', nullable: true })
  cardURL: string;

  @Column({ default: 0 })
  status: number;

  @Column({ name: 'message', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProvinceEntity, (p) => p.officeInfos)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @ManyToOne(() => DistrictEntity, (d) => d.officeInfos)
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @ManyToOne(() => LlgEntity, (l) => l.officeInfos)
  @JoinColumn({ name: 'llg_id' })
  llg: LlgEntity;

  @ManyToOne(() => WardEntity, (w) => w.officeInfos)
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;
}
