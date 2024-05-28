import { ConnectionsGqlQueryResolver } from './connections.gql-query-resolver';
import { JourneyGqlQueryResolver } from './journey.gql-query-resolver';
import { StationsGqlQueryResolver } from './stations.gql-query-resolver';

export const queryResolvers = [
  ConnectionsGqlQueryResolver,
  JourneyGqlQueryResolver,
  StationsGqlQueryResolver,
];
