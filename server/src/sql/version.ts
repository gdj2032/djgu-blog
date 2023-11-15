export const VERSION_SQL = {
  queryAll: 'SELECT * FROM version',
  queryLimitOffset: 'SELECT * FROM version LIMIT ?, ?',
  queryById: 'SELECT * FROM version WHERE id=?',
  queryByIds: 'SELECT * FROM version WHERE id in (?)',
  queryByName: 'SELECT * FROM version WHERE name=?',
  query: 'SELECT * FROM version WHERE used=? AND type=?',
  insert: 'INSERT INTO version (id, name, used, createTime, zipPath, type) VALUES(?,?,?,?,?,?)',
  update: 'UPDATE version SET ? WHERE id = ?',
  deleteById: 'DELETE FROM version where id=?',
  updateVersionUsed: 'UPDATE version SET used = ?',
}