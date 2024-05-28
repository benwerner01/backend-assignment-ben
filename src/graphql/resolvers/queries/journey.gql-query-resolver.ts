import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetJourneyArgs } from '~/core/args';
import { JourneyModel } from '~/core/models';
import { JourneyService } from '~/core/services';

@Resolver()
export class JourneyGqlQueryResolver {
  constructor(private readonly journeyService: JourneyService) {}

  @Query(() => JourneyModel)
  public async journey(@Args() args: GetJourneyArgs): Promise<JourneyModel> {
    // TODO: implement fetching journey from journey service
    return {} as any;
  }
}
