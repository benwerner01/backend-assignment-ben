import { ConnectionModel, StationModel, SectionModel } from '~/core/models';
import { ConnectionSchema, StationSchema } from '~/infra/opendata';

export const mapStationSchemaToModel = (
  station: StationSchema,
): StationModel => ({
  id: station.id,
  name: station.name,
  coordinates: {
    latitude: station.coordinate.x,
    longitude: station.coordinate.y,
  },
});

export const mapConnectionSchemaToConnectionModel = (
  schema: ConnectionSchema,
): ConnectionModel => {
  const from = mapStationSchemaToModel(schema.from.station);
  const to = mapStationSchemaToModel(schema.to.station);

  const departure = new Date(schema.from.departure);
  const arrival = new Date(schema.to.arrival);

  const sections = schema.sections.map<SectionModel>((section) => ({
    from: mapStationSchemaToModel(section.departure.station),
    to: mapStationSchemaToModel(section.arrival.station),
    departure: new Date(section.departure.departure),
    arrival: new Date(section.arrival.arrival),
  }));

  return {
    from,
    to,
    departure,
    arrival,
    sections,
  };
};
