import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StationModel } from './station.model';

@ObjectType('Journey')
export class JourneyModel {
  @Field(() => ID)
  id: string;

  @Field(() => StationModel)
  from: StationModel;

  @Field(() => StationModel)
  to: StationModel;

  @Field(() => [StationModel])
  via: StationModel[];
}
