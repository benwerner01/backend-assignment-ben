import { Module } from '@nestjs/common';
import { InfraModule } from '~/infra/infra.module';
import { ConnectionService } from './services/connection.service';
import { JourneyService } from './services/journey.service';
import { StationService } from './services/station.service';

const services = [ConnectionService, JourneyService, StationService];

@Module({
  imports: [InfraModule],
  providers: [...services],
  exports: [...services],
})
export class CoreModule {}
