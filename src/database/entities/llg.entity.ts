import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DistrictEntity } from './district.entity';
import { WardEntity } from './ward.entity';
import { OfficeEntity } from './office.entity';

@Entity({ name: 'llg' })
export class LlgEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'district_id', type: 'bigint' })
  districtId: number;

  @Column()
  llg: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @ManyToOne(() => DistrictEntity)
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @OneToMany(() => WardEntity, (wards) => wards.llg)
  wards: WardEntity[];

  @OneToMany(() => OfficeEntity, (o) => o.llg)
  officeInfos: OfficeEntity[];
}
