import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne } from 'typeorm';
import { User } from './user.model';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true })
  serialNumber: string;

  @Index()
  @Column({ nullable: false, unique: true })
  tagId: string;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  costCenter: string;

  @Column({ nullable: false })
  assetClass: string;

  @Column({ nullable: false })
  assetType: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  assetDetails: string;

  @Column({ nullable: true })
  freeTextField: string;

  @Column({ nullable: false })
  assetCondition: string;

  @Column({ nullable: false })
  assetStatus: string;

  @Column({ nullable: true })
  assignedTo: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}