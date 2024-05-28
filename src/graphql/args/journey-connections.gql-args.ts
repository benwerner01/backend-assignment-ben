import { ArgsType, PickType } from '@nestjs/graphql';
import { GetConnectionsArgs } from '~/core/args';

@ArgsType()
export class JourneyConnectionsGqlArgs extends PickType(GetConnectionsArgs, [
  'departsAt',
  'after',
] as const) {}
