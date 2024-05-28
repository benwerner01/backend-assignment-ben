import { Resolver } from '@nestjs/graphql';
import { ConnectionService } from '~/core/services';
import { JourneyModel } from '~/core/models';

@Resolver(() => JourneyModel)
export class JourneyGqlModelResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  // TODO: implement `connections` field resolver for `Journey`
}
