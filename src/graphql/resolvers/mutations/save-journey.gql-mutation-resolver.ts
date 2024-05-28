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
    // TODO: implement fetching stations from station service
    // TODO: implement saving respective journey to database
    return {} as any;
  }
}
