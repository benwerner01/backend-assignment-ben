import { Inject } from '@nestjs/common';
import { KYSELY_MODULE_CONNECTION_TOKEN } from 'nestjs-kysely';

/**
 * Replaces the built-in `InjectKysely` decorator from `nestjs-kysely due to
 * a typing bug in the library.
 *
 * @see https://github.com/kazu728/nestjs-kysely/issues/16
 */
export const InjectDb = () => Inject(KYSELY_MODULE_CONNECTION_TOKEN);
