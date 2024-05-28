interface SaveJourneyStation {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export class SaveJourneyArgs {
  from: SaveJourneyStation;

  to: SaveJourneyStation;

  via: SaveJourneyStation[];
}
