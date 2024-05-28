import { Pool } from 'pg';
import { Module } from '@nestjs/common';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: 'localhost',
          user: 'postgres',
          password: 'postgres',
          database: 'assignment',
        }),
      }),
    }),
    GraphqlModule,
  ],
})
export class AppModule {}
