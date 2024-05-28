import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType('Coordinates')
export class CoordinatesModel {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}
