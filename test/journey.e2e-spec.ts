import * as request from 'supertest';
import { KYSELY_MODULE_CONNECTION_TOKEN, KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { GraphqlModule } from '~/graphql/graphql.module';

describe('journey resolvers', () => {
  let app: INestApplication;
  let db: Kysely<any>;

  const appModuleBuilder = () =>
    Test.createTestingModule({
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
    });

  beforeEach(async () => {
    const appModule: TestingModule = await appModuleBuilder().compile();

    app = appModule.createNestApplication();
    await app.init();

    db = app.get(KYSELY_MODULE_CONNECTION_TOKEN);
  });

  afterAll(async () => {
    // TODO: (OPTIONAL) drop contents from all tables
  });

  const saveJourneyMutation = `
  mutation SaveJourney($from: ID!, $to: ID!, $via: [ID!]) {
    saveJourney(from: $from, to: $to, via: $via) {
      id
      from {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
      to {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
      via {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
    }
  }
  `;

  const getJourneyQuery = `
  query GetJourney($id: ID!) {
    journey(id: $id) {
      id
      from {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
      to {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
      via {
        id
        name
        coordinates {
          latitude
          longitude
        }
      }
    }
  }
  `;

  const journey = {
    from: {
      id: '8504300',
      name: 'Biel/Bienne',
      coordinates: {
        latitude: 47.132902,
        longitude: 7.242918,
      },
    },
    to: {
      id: '8501120',
      name: 'Lausanne',
      coordinates: {
        latitude: 46.516795,
        longitude: 6.629087,
      },
    },
    via: [
      {
        id: '8503000',
        name: 'Zürich HB',
        coordinates: {
          latitude: 47.377847,
          longitude: 8.540502,
        },
      },
    ],
  };

  describe('saveJourney (mutation)', () => {
    it('simple journey', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: saveJourneyMutation,
          variables: {
            from: '8504300',
            to: '8501120',
            via: ['8503000'],
          },
        })
        .expect(200)
        .expect(async ({ body }) => {
          const { id, ...result } = body.data.saveJourney;
          expect(result).toEqual(journey);

          return request(app.getHttpServer())
            .post('/graphql')
            .send({
              query: getJourneyQuery,
              variables: { id },
            })
            .expect(200)
            .expect(({ body }) => {
              const result = body.data.journey;
              expect(result).toEqual({ id, ...journey });
            });
        });
    });
  });

  describe('journey (query)', () => {
    let id: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: saveJourneyMutation,
          variables: {
            from: '8504300',
            to: '8501120',
            via: ['8503000'],
          },
        })
        .expect(200);

      id = response.body.data.saveJourney.id;
    });

    it('simple journey', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getJourneyQuery,
          variables: { id },
        })
        .expect(200)
        .expect(({ body }) => {
          const result = body.data.journey;
          expect(result).toEqual({ id, ...journey });
        });
    });

    it('no http request', async () => {
      const appModule: TestingModule = await appModuleBuilder()
        .overrideProvider(HttpService)
        .useValue({})
        .compile();
      app = appModule.createNestApplication();
      await app.init();

      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getJourneyQuery,
          variables: { id },
        })
        .expect(200)
        .expect(({ body }) => {
          const result = body.data.journey;
          expect(result).toEqual({ id, ...journey });
        });
    });

    it('resolve connections field', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
        query {
          journey(id: "${id}") { 
            connections(departsAt: "2024-03-10T10:10:00.000") {
              nodes {
                from {
                  id
                }
                to {
                  id
                }
                departure
                arrival
                sections {
                  from {
                    id
                  }
                  to {
                    id
                  }
                  departure
                  arrival
                }
              }
            }
          }
        }
        `,
          variables: {},
        })

        .expect(({ body }) => {
          const connections = body.data.journey.connections.nodes;
          expect(connections).toHaveLength(2);
          expect(connections[0]).toEqual({
            from: { id: '8504300' },
            to: { id: '8501120' },
            departure: '2024-03-10T09:46:00.000Z',
            arrival: '2024-03-10T13:16:00.000Z',
            sections: [
              {
                from: { id: '8504300' },
                to: { id: '8503000' },
                departure: '2024-03-10T09:46:00.000Z',
                arrival: '2024-03-10T10:56:00.000Z',
              },
              {
                from: { id: '8503000' },
                to: { id: '8507000' },
                departure: '2024-03-10T11:02:00.000Z',
                arrival: '2024-03-10T11:58:00.000Z',
              },
              {
                from: { id: '8507000' },
                to: { id: '8501120' },
                departure: '2024-03-10T12:04:00.000Z',
                arrival: '2024-03-10T13:16:00.000Z',
              },
            ],
          });
        });
    });
  });
});
