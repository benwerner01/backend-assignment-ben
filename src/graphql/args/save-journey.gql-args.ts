import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class SaveJourneyGqlArgs {
  @Field(() => ID)
  from: string;

  @Field(() => ID)
  to: string;

  @Field(() => [ID], { nullable: true })
  via?: string[] | null;
}
