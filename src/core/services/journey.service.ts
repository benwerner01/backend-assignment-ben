import { Kysely } from 'kysely';
import { Injectable } from '@nestjs/common';
import { InjectDb } from '~/infra/database';
import { JourneyModel } from '../models';
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

  public async saveJourney(args: SaveJourneyArgs): Promise<string> {
    // TODO: implement saving journey to database, returning the id.
    return 'not-a-real-id';
  }
}
