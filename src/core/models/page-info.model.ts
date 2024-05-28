import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PageInfo')
export class PageInfoModel {
  @Field(() => String, { nullable: true })
  endCursor: string | null;
}
