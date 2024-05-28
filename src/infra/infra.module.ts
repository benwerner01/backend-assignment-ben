import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpendataService } from './opendata/opendata.service';

@Module({
  imports: [HttpModule],
  providers: [OpendataService],
  exports: [OpendataService],
})
export class InfraModule {}
