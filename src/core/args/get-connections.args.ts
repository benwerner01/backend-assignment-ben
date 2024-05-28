import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetConnectionsArgs {
  @Field(() => ID)
  from: string;

  @Field(() => ID)
  to: string;

  @Field(() => [ID], { nullable: true })
  via?: string[] | null;

  @Field(() => Date, { nullable: true })
  departsAt?: Date | null;

  @Field(() => String, { nullable: true })
  after?: string | null;
}
