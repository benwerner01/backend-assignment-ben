import { Field, ObjectType } from '@nestjs/graphql';
import { StationModel } from './station.model';

@ObjectType('Section')
export class SectionModel {
  @Field(() => StationModel)
  from: StationModel;

  @Field(() => StationModel)
  to: StationModel;

  @Field(() => Date)
  departure: Date;

  @Field(() => Date)
  arrival: Date;
}
