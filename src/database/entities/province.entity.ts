import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DistrictEntity } from './district.entity';
import { OfficeEntity } from './office.entity';

@Entity({ name: 'province' })
export class ProvinceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  province: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @OneToMany(() => DistrictEntity, (districts) => districts.province)
  districts: DistrictEntity[];

  @OneToMany(() => OfficeEntity, (o) => o.province)
  officeInfos: OfficeEntity[];
}
