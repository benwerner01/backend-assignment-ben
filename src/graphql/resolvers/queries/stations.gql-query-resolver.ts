import { Args, Query, Resolver } from '@nestjs/graphql';
import { StationModel } from '~/core/models';
import { GetStationsArgs } from '~/core/args';
import { StationService } from '~/core/services';

@Resolver()
export class StationsGqlQueryResolver {
  constructor(private readonly stationService: StationService) {}

  @Query(() => [StationModel])
  public async stations(
    @Args() args: GetStationsArgs,
  ): Promise<StationModel[]> {
    const { query } = args;

    const stations = await this.stationService.getStations({ query });

    return stations;
  }
}
