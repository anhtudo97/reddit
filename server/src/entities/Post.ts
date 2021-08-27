import { Field } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    texxt!: string;

    @Field()
	@CreateDateColumn()
	createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date
}