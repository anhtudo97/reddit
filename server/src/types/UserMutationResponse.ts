
import { Field, ObjectType } from 'type-graphql'

import { FieldError } from './FieldError';
import { User } from 'src/entities/User'
import { IMutationResponse } from './MutationResponse'

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	user?: User

	@Field(_type => [FieldError], { nullable: true })
	errors?: FieldError[]
}