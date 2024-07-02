import { Injectable } from '@nestjs/common';
import { OpendataService, StationSchema } from '~/infra/opendata';
import { StationModel } from '../models/station.model';
import { GetStationsArgs } from '../args/get-stations.args';

const mapStationSchemaToModel = (station: StationSchema): StationModel => ({
  id: station.id,
  name: station.name,
  coordinates: {
    latitude: station.coordinate.x,
    longitude: station.coordinate.y,
  },
});

@Injectable()
export class StationService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getStation(args: GetStationsArgs): Promise<StationModel> {
    // TODO: implement fetching station from the OpenData service
    return {} as any;
  }

  public async getStations(args: GetStationsArgs): Promise<StationModel[]> {
    const { query } = args;

    const stations = await this.opendataService.getStations({ query });

    return stations.map(mapStationSchemaToModel);
  }
}
