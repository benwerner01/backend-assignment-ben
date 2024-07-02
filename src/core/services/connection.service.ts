import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { mapConnectionSchemaToConnectionModel } from '~/shared/mappings';
import { GetConnectionsArgs } from '../args/get-connections.args';
import { decodeCursor, encodeCursor } from '../helpers';
import { ConnectionListModel } from '../models';

@Injectable()
export class ConnectionService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getConnections(
    args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    const { after, via, departsAt, ...remainingArgs } = args;
    const page = after ? decodeCursor(after) : 0;

    const connections = await this.opendataService.getConnections({
      ...remainingArgs,
      departsAt: departsAt ?? undefined,
      via: via ?? undefined,
      limit: 2,
      page,
    });

    const paginatedConnections = connections.slice(0, 2);

    /**
     * @todo: determine whether there is a next page, and return
     * `null` if there isn't one.
     */

    const nextPage = page + 1;

    const endCursor = encodeCursor(nextPage);

    const nodes = paginatedConnections.map(
      mapConnectionSchemaToConnectionModel,
    );

    return {
      nodes,
      pageInfo: { endCursor },
    };
  }
}
