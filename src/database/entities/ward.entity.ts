import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LlgEntity } from './llg.entity';
import { OfficeEntity } from './office.entity';

@Entity({ name: 'ward' })
export class WardEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'llg_id', type: 'bigint' })
  llgId: number;

  @Column()
  ward: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date;

  @ManyToOne(() => LlgEntity)
  @JoinColumn({ name: 'llg_id' })
  llg: LlgEntity;

  @OneToMany(() => OfficeEntity, (o) => o.ward)
  officeInfos: OfficeEntity[];
}
