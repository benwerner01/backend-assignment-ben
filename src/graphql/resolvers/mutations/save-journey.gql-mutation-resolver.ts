import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JourneyModel } from '~/core/models';
import { JourneyService, StationService } from '~/core/services';
import { SaveJourneyGqlArgs } from '../../args';

@Resolver()
export class SaveJourneyGqlMutationResolver {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly stationService: StationService,
  ) {}

  @Mutation(() => JourneyModel)
  public async saveJourney(
    @Args() args: SaveJourneyGqlArgs,
  ): Promise<JourneyModel> {
    const { from, to, via } = args;

    const [fromStation, toStation, viaStations] = await Promise.all([
      this.stationService.getStation({ query: from }),
      this.stationService.getStation({ query: to }),
      via
        ? Promise.all(
            via.map((query) => this.stationService.getStation({ query })),
          )
        : [],
    ]);

    const journeyId = await this.journeyService.saveJourney({
      from: fromStation,
      to: toStation,
      via: viaStations,
    });

    return {
      id: journeyId,
      from: fromStation,
      to: toStation,
      via: viaStations,
    };
  }
}
