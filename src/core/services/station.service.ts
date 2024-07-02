import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { StationModel } from '../models/station.model';
import { GetStationsArgs } from '../args/get-stations.args';
import { mapStationSchemaToModel } from '~/shared/mappings';

@Injectable()
export class StationService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getStation(args: GetStationsArgs): Promise<StationModel> {
    const stations = await this.getStations(args);

    /** @todo: use the `/stationboard` endpoint instead  */
    return stations[0];
  }

  public async getStations(args: GetStationsArgs): Promise<StationModel[]> {
    const { query } = args;

    const stations = await this.opendataService.getStations({ query });

    return stations.map(mapStationSchemaToModel);
  }
}
