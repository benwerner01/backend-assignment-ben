import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfoModel } from './page-info.model';
import { ConnectionModel } from './connection.model';

@ObjectType('ConnectionConnection')
export class ConnectionListModel {
  @Field(() => [ConnectionModel])
  nodes: ConnectionModel[];

  @Field(() => PageInfoModel)
  pageInfo: PageInfoModel;
}
