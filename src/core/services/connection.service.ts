import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { GetConnectionsArgs } from '../args/get-connections.args';
import { ConnectionListModel } from '../models';

@Injectable()
export class ConnectionService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getConnections(
    args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    // TODO: get connections from the OpenData service
    return {} as any;
  }
}
