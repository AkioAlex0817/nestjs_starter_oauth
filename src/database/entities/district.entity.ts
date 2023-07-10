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
import { ProvinceEntity } from './province.entity';
import { LlgEntity } from './llg.entity';
import { OfficeEntity } from './office.entity';

@Entity({ name: 'district' })
export class DistrictEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'province_id', type: 'bigint' })
  provinceId: number;

  @Column()
  district: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @ManyToOne(() => ProvinceEntity)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @OneToMany(() => LlgEntity, (llgs) => llgs.district)
  llgs: LlgEntity[];

  @OneToMany(() => OfficeEntity, (o) => o.district)
  officeInfos: OfficeEntity[];
}
