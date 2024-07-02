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
    const { id } = args;

    const journeyResult = await sql<{
      journey_id: string;
      from_station_id: string;
      from_station_name: string;
      from_station_latitude: number;
      from_station_longitude: number;
      to_station_id: string;
      to_station_name: string;
      to_station_latitude: number;
      to_station_longitude: number;
    }>`
      SELECT 
        j.id as journey_id,
        f.id as from_station_id,
        f.name as from_station_name,
        f.latitude as from_station_latitude,
        f.longitude as from_station_longitude,
        t.id as to_station_id,
        t.name as to_station_name,
        t.latitude as to_station_latitude,
        t.longitude as to_station_longitude
      FROM journeys j
      JOIN stations f ON j.from_station_id = f.id
      JOIN stations t ON j.to_station_id = t.id
      WHERE j.id = ${id}
    `.execute(this.db);

    const journeyRow = journeyResult.rows[0];

    if (!journeyRow) {
      throw new Error(`Journey with id ${id} not found`);
    }

    const fromStation: StationModel = {
      id: journeyRow.from_station_id,
      name: journeyRow.from_station_name,
      coordinates: {
        latitude: journeyRow.from_station_latitude,
        longitude: journeyRow.from_station_longitude,
      },
    };

    const toStation: StationModel = {
      id: journeyRow.to_station_id,
      name: journeyRow.to_station_name,
      coordinates: {
        latitude: journeyRow.to_station_latitude,
        longitude: journeyRow.to_station_longitude,
      },
    };

    const viaStationsResult = await sql<{
      station_id: string;
      station_name: string;
      station_latitude: number;
      station_longitude: number;
    }>`
      SELECT 
        s.id as station_id,
        s.name as station_name,
        s.latitude as station_latitude,
        s.longitude as station_longitude
      FROM journey_via_stations jvs
      JOIN stations s ON jvs.station_id = s.id
      WHERE jvs.journey_id = ${id}
    `.execute(this.db);

    const viaStations: StationModel[] = viaStationsResult.rows.map((row) => ({
      id: row.station_id,
      name: row.station_name,
      coordinates: {
        latitude: row.station_latitude,
        longitude: row.station_longitude,
      },
    }));

    return {
      id: journeyRow.journey_id,
      from: fromStation,
      to: toStation,
      via: viaStations,
    };
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
