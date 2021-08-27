import { Field } from 'type-graphql';
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column()
	password!: string

    @Field()
	@CreateDateColumn()
	createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date
}