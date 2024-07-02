import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConnectionSchema, StationSchema } from './schemas';
import { GetConnectionsParams, GetStationsParams } from './interfaces';
import { toDateString, toTimeString } from '~/core/helpers';

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
    const { query } = params;

    /** @todo: type the axios response */
    const { data } = await this.httpService.axiosRef.get(
      'http://transport.opendata.ch/v1/locations',
      {
        params: {
          query,
          // We only want stations returned from the `/locations` endpoint
          type: 'station',
        },
      },
    );

    const { stations } = data;

    return stations;
  }

  public async getConnections(
    params: GetConnectionsParams,
  ): Promise<ConnectionSchema[]> {
    const { from, to, via, departsAt, limit, page } = params;

    const { data } = await this.httpService.axiosRef.get(
      'http://transport.opendata.ch/v1/connections',
      {
        params: {
          from,
          to,
          via,
          date: departsAt ? toDateString(departsAt) : undefined,
          time: departsAt ? toTimeString(departsAt) : undefined,
          limit,
          page,
        },
      },
    );

    const { connections } = data;

    return connections;
  }
}
