import { Kysely, sql } from 'kysely';
import { Injectable } from '@nestjs/common';
import { InjectDb } from '~/infra/database';
import { JourneyModel, StationModel } from '../models';
import { GetJourneyArgs } from '../args/get-journey.args';
import { SaveJourneyArgs } from '../args/save-journey.args';

@Injectable()
export class JourneyService {
  /**
   * Kysely is a type-safe and autocompletion-friendly TypeScript SQL query builder.
   *
   * We are assuming you are not familiar with Kysely, hence we suggest you to drop down
   * to raw SQL queries. If you are familiar with Kysely, feel free to properly type the
   * `db` property and use the respective Kysely methods.
   *
   * ### Examples
   *
   * Simple query to fetch all persons:
   *
   * ```ts
   * const result = await sql<Person[]>`select * from person`.execute(db)
   * ```
   *
   * Simple transaction, inserting multiple persons:
   *
   * ```ts
   * await db.transaction().execute(async (trx) => {
   *  const current = await sql<Person[]>`select * from person`.execute(trx)
   *  // ...
   *  const values = people.map((p) => sql`(${p.id}, ${p.name})`)
   *  const new = await sql<Person[]>`insert into person (id, name) values ${sql.join(values)} returning *`.execute(trx)
   * })
   * ```
   *
   * @see https://kysely.dev/docs/intro
   */
  constructor(@InjectDb() private readonly db: Kysely<any>) {}

  public async getJourney(args: GetJourneyArgs): Promise<JourneyModel> {
    // TODO: implement fetchig journey from database
    return {} as any;
  }

  /**
   * Inserts a station into the database if it doesn't exist and returns the station ID.
   */
  private async insertOrGetStation(station: StationModel): Promise<string> {
    const existingStation = await sql<{ id: string }>`
      SELECT id
      FROM stations
      WHERE name = ${station.name}
      AND latitude = ${station.coordinates.latitude}
      AND longitude = ${station.coordinates.longitude}
    `.execute(this.db);

    if (existingStation.rows.length > 0) {
      return existingStation.rows[0].id;
    }

    const result = await sql<{ id: string }>`
      INSERT INTO stations (name, latitude, longitude)
      VALUES (${station.name}, ${station.coordinates.latitude}, ${station.coordinates.longitude})
      RETURNING id
    `.execute(this.db);

    return result.rows[0].id;
  }

  public async saveJourney(args: SaveJourneyArgs): Promise<string> {
    const { from, to, via } = args;

    const fromStationId = await this.insertOrGetStation(from);
    const toStationId = await this.insertOrGetStation(to);

    const result = await sql<{ id: string }>`
      INSERT INTO journeys (from_station_id, to_station_id)
      VALUES (${fromStationId}, ${toStationId})
      RETURNING id
    `.execute(this.db);

    const journeyId = result.rows[0].id;

    for (const viaStation of via) {
      const viaStationId = await this.insertOrGetStation(viaStation);
      await sql`
        INSERT INTO journey_via_stations (journey_id, station_id)
        VALUES (${journeyId}, ${viaStationId})
      `.execute(this.db);
    }

    return journeyId;
  }
}
