import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { StationModel } from '../models/station.model';
import { GetStationsArgs } from '../args/get-stations.args';

@Injectable()
export class StationService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getStation(args: GetStationsArgs): Promise<StationModel> {
    // TODO: implement fetching station from the OpenData service
    return {} as any;
  }

  public async getStations(args: GetStationsArgs): Promise<StationModel[]> {
    // TODO: implement fetching stations from the OpenData service
    return [];
  }
}
