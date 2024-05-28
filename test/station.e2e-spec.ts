import * as request from 'supertest';
import { KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphqlModule } from '~/graphql/graphql.module';

describe('station resolvers', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [
        KyselyModule.forRoot({
          dialect: new PostgresDialect({
            pool: new Pool({
              host: 'localhost',
              user: 'postgres',
              password: 'postgres',
              database: 'assignment_test',
            }),
          }),
        }),
        GraphqlModule,
      ],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();
  });

  describe('stations (query)', () => {
    const getStationsQuery = `
    query GetStations($query: String!) {
      stations(query: $query) { 
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
    }
    `;

    it('simple search', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getStationsQuery,
          variables: { query: 'Basel, Dreispitz' },
        })
        .expect(200)
        .expect(({ body }) => {
          const stations = body.data.stations;
          expect(stations).toHaveLength(2);
          expect(stations[0]).toEqual({
            id: '8500096',
            name: 'Basel, Dreispitz',
            coordinates: {
              latitude: 47.537169,
              longitude: 7.608832,
            },
          });
          expect(stations[1]).toEqual({
            id: '8500136',
            name: 'Basel Dreispitz',
            coordinates: {
              latitude: 47.537437,
              longitude: 7.609603,
            },
          });
        });
    });

    it('identifier lookup', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getStationsQuery,
          variables: { query: '8503000' },
        })
        .expect(200)
        .expect(({ body }) => {
          const stations = body.data.stations;
          expect(stations).toHaveLength(1);
          expect(stations[0]).toEqual({
            id: '8503000',
            name: 'Zürich HB',
            coordinates: {
              latitude: 47.377847,
              longitude: 8.540502,
            },
          });
        });
    });

    it('address lookup', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getStationsQuery,
          variables: { query: 'grape insurance ag' },
        })
        .expect(200)
        .expect(({ body }) => {
          const stations = body.data.stations;
          expect(stations).toHaveLength(0);
        });
    });
  });
});
