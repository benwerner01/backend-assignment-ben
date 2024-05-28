import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CoordinatesModel } from './coordinates.model';

@ObjectType('Station')
export class StationModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => CoordinatesModel)
  coordinates: CoordinatesModel;
}
