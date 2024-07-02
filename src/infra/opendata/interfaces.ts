export interface GetStationsParams {
  query: string;
}

export interface GetConnectionsParams {
  from: string;
  to: string;
  via?: string[];
  departsAt?: Date;
  // 1 - 16. Specifies the number of connections to return. If several connections depart at the same time they are counted as 1.
  limit?: number;
  // 0 - 3. Allows pagination of connections. Zero-based, so first page is 0, second is 1, third is 2 and so on.
  page?: number;
}
