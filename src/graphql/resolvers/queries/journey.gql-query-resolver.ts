import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetJourneyArgs } from '~/core/args';
import { JourneyModel } from '~/core/models';
import { JourneyService } from '~/core/services';

@Resolver()
export class JourneyGqlQueryResolver {
  constructor(private readonly journeyService: JourneyService) {}

  @Query(() => JourneyModel)
  public async journey(@Args() args: GetJourneyArgs): Promise<JourneyModel> {
    const { id } = args;

    const journey = await this.journeyService.getJourney({ id });

    return journey;
  }
}
