import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetStationsArgs {
  @Field(() => String)
  query: string;
}
