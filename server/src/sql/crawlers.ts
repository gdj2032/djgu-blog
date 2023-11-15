export const CRAWLERS_SQL = {
  queryAll: 'SELECT * FROM crawlers_web',
  queryLimitOffset: 'SELECT * FROM crawlers_web LIMIT ?, ?',
  queryById: 'SELECT * FROM crawlers_web WHERE id=?',
}
