/**
 * OpenData Zod Schemas
 *
 * These schemas can be used to validate the response from the OpenData API
 * at runtime, facilitating the implementation of the `OpendataService` methods.
 */

import { z } from 'zod';

export const StationSchema = z.object({
  id: z.string().min(1).max(15),
  name: z.string().min(1),
  coordinate: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
export type StationSchema = z.infer<typeof StationSchema>;

const ArrivalCheckpointSchema = z.object({
  station: StationSchema,
  arrival: z.string().datetime({ offset: true }),
});

const DepartureCheckpointSchema = z.object({
  station: StationSchema,
  departure: z.string().datetime({ offset: true }),
  departureTimestamp: z.number(),
});

export const ConnectionSchema = z.object({
  from: DepartureCheckpointSchema,
  to: ArrivalCheckpointSchema,
  sections: z.array(
    z.object({
      departure: DepartureCheckpointSchema,
      arrival: ArrivalCheckpointSchema,
    }),
  ),
});
export type ConnectionSchema = z.infer<typeof ConnectionSchema>;
