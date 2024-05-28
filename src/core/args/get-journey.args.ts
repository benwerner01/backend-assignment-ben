import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetJourneyArgs {
  @Field(() => ID)
  id: string;
}
