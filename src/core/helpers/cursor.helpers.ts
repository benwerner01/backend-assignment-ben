export const encodeCursor = (page: number): string => {
  const json = JSON.stringify({ page });
  return Buffer.from(json).toString('base64');
};

export const decodeCursor = (cursor?: string): number => {
  if (cursor === undefined) return 0;

  const json = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
  return json.page;
};
