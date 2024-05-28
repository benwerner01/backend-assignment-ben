import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConnectionSchema, StationSchema } from './schemas';
import { GetConnectionsParams, GetStationsParams } from './interfaces';

@Injectable()
export class OpendataService {
  /**
   * The `HttpService` is a wrapper around the `Axios` HTTP client.
   * If you are not familiar with the Nest.js `HttpService`, feel free to use the underlying Axios instance directly.
   *
   * ```ts
   * this.httpService.axiosRef.get(...)
   * ```
   *
   * @see https://docs.nestjs.com/techniques/http-module
   */
  constructor(private httpService: HttpService) {}

  public async getStations(
    params: GetStationsParams,
  ): Promise<StationSchema[]> {
    // TODO: implement fetching stations from OpenData API
    return [];
  }

  public async getConnections(
    params: GetConnectionsParams,
  ): Promise<ConnectionSchema[]> {
    // TODO: implement fetching connections from OpenData API
    return [];
  }
}
