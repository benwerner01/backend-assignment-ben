import * as request from 'supertest';
import { KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphqlModule } from '~/graphql/graphql.module';

describe('connection resolvers', () => {
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

  describe('connections (query)', () => {
    const getConnectionsQuery = `
    query GetConnections($after: String, $departsAt: DateTime, $from: ID!, $to: ID!, $via: [ID!]) {
      connections(after: $after, departsAt: $departsAt, from: $from, to: $to, via: $via) { 
        nodes {
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
          departure
          arrival
          sections {
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
            departure
            arrival
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
    `;

    const basel = {
      id: '8500010',
      name: 'Basel SBB',
      coordinates: {
        latitude: 47.547412,
        longitude: 7.589577,
      },
    };

    const zurich = {
      id: '8503000',
      name: 'Zürich HB',
      coordinates: {
        latitude: 47.377847,
        longitude: 8.540502,
      },
    };

    const olten = {
      id: '8500218',
      name: 'Olten',
      coordinates: {
        latitude: 47.351936,
        longitude: 7.907707,
      },
    };

    const bern = {
      id: '8507000',
      name: 'Bern',
      coordinates: {
        latitude: 46.948832,
        longitude: 7.439136,
      },
    };

    const geneva = {
      id: '8501008',
      name: 'Genève',
      coordinates: {
        latitude: 46.210228,
        longitude: 6.142435,
      },
    };

    it('simple search', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getConnectionsQuery,
          variables: {
            from: '8500010',
            to: '8503000',
            departsAt: '2024-03-10T10:10:00.000',
          },
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.connections.pageInfo.endCursor).toEqual(
            'eyJwYWdlIjoxfQ==',
          );

          const connections = body.data.connections.nodes;
          expect(connections).toHaveLength(2);
          expect(connections[0]).toEqual({
            from: basel,
            to: zurich,
            departure: '2024-03-10T09:33:00.000Z',
            arrival: '2024-03-10T10:26:00.000Z',
            sections: [
              {
                from: basel,
                to: zurich,
                departure: '2024-03-10T09:33:00.000Z',
                arrival: '2024-03-10T10:26:00.000Z',
              },
            ],
          });
          expect(connections[1]).toEqual({
            from: basel,
            to: zurich,
            departure: '2024-03-10T09:37:00.000Z',
            arrival: '2024-03-10T10:49:00.000Z',
            sections: [
              {
                from: basel,
                to: zurich,
                departure: '2024-03-10T09:37:00.000Z',
                arrival: '2024-03-10T10:49:00.000Z',
              },
            ],
          });
        });
    });

    it('paginated search', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getConnectionsQuery,
          variables: {
            from: '8500010',
            to: '8503000',
            departsAt: '2024-03-10T10:10:00.000',
            after: 'eyJwYWdlIjoxfQ==',
          },
        })
        .expect(200)
        .expect(({ body }) => {
          const connections = body.data.connections.nodes;
          expect(connections).toHaveLength(2);
          expect(connections[0]).toEqual({
            from: basel,
            to: zurich,
            departure: '2024-03-10T09:43:00.000Z',
            arrival: '2024-03-10T10:52:00.000Z',
            sections: [
              {
                from: basel,
                to: zurich,
                departure: '2024-03-10T09:43:00.000Z',
                arrival: '2024-03-10T10:52:00.000Z',
              },
            ],
          });
        });
    });

    it('complex search', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getConnectionsQuery,
          variables: {
            from: '8501008',
            to: '8503000',
            via: ['8500010'],
            departsAt: '2024-03-10T10:10:00.000',
            after: 'eyJwYWdlIjo0fQ==',
          },
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.connections.pageInfo.endCursor).toEqual(
            'eyJwYWdlIjo1fQ==',
          );

          const connections = body.data.connections.nodes;
          expect(connections).toHaveLength(2);
          expect(connections[0]).toEqual({
            from: geneva,
            to: zurich,
            departure: '2024-03-10T13:15:00.000Z',
            arrival: '2024-03-10T17:00:00.000Z',
            sections: [
              {
                from: geneva,
                to: olten,
                departure: '2024-03-10T13:15:00.000Z',
                arrival: '2024-03-10T15:18:00.000Z',
              },
              {
                from: olten,
                to: basel,
                departure: '2024-03-10T15:33:00.000Z',
                arrival: '2024-03-10T16:01:00.000Z',
              },
              {
                from: basel,
                to: zurich,
                departure: '2024-03-10T16:06:00.000Z',
                arrival: '2024-03-10T17:00:00.000Z',
              },
            ],
          });
        });
    });

    it('invalid search', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getConnectionsQuery,
          variables: {
            from: 'kcadads',
            to: 'lakdmlk',
          },
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.connections.pageInfo.endCursor).toBeNull();
          expect(body.data.connections.nodes).toHaveLength(0);
        });
    });
  });
});
