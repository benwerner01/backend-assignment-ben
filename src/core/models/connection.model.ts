import { Field, ObjectType } from '@nestjs/graphql';
import { StationModel } from './station.model';
import { SectionModel } from './section.model';

@ObjectType('Connection')
export class ConnectionModel {
  @Field(() => StationModel)
  from: StationModel;

  @Field(() => StationModel)
  to: StationModel;

  @Field(() => Date)
  departure: Date;

  @Field(() => Date)
  arrival: Date;

  @Field(() => [SectionModel])
  sections: SectionModel[];
}
