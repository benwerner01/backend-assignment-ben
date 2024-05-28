import { modelResolvers } from './models';
import { mutationResolvers } from './mutations';
import { queryResolvers } from './queries';

export const resolvers = [
  ...modelResolvers,
  ...mutationResolvers,
  ...queryResolvers,
];
