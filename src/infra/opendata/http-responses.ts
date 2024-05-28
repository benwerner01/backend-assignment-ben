/**
 * OpenData HTTP Response Interfaces
 *
 * These interfaces can be used to type the response from the OpenData API,
 * facilitating the implementation of the `OpendataService` methods.
 */

export interface LocationsHttpResponse {
  stations: StationHttpResponse[];
}

export interface ConnectionsHttpResponse {
  connections: {
    from: CheckpointHttpResponse;
    to: CheckpointHttpResponse;
    sections: SectionHttpResponse[];
  }[];
}

interface StationHttpResponse {
  id: string | null;
  name: string;
  coordinate: {
    x: number | null;
    y: number | null;
  };
}

interface CheckpointHttpResponse {
  station: StationHttpResponse;
  arrival: string | null;
  departure: string | null;
}

interface SectionHttpResponse {
  departure: CheckpointHttpResponse;
  arrival: CheckpointHttpResponse;
}
