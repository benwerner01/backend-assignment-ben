import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetConnectionsArgs } from '~/core/args';
import { ConnectionListModel } from '~/core/models';
import { ConnectionService } from '~/core/services';

@Resolver()
export class ConnectionsGqlQueryResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  @Query(() => ConnectionListModel)
  public async connections(
    @Args() args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    const connectionsList = await this.connectionService.getConnections(args);

    return connectionsList;
  }
}
