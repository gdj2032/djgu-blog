export const ROUTE_SQL = {
  queryAll: 'SELECT * FROM route',
  queryLimitOffset: 'SELECT * FROM route LIMIT ?, ?',
  queryLimitOffset2: 'SELECT * FROM route WHERE name LIKE ? OR description LIKE ? ORDER BY see DESC LIMIT ?, ?',
  queryById: 'SELECT * FROM route WHERE id=?',
  queryByIds: 'SELECT * FROM route WHERE id in (?)',
  queryByName: 'SELECT * FROM document WHERE name=?',
  insert: 'INSERT INTO route (id, name, description, father_id, path, role) VALUES(?,?,?,?,?,?)',
  update: 'UPDATE route SET ? WHERE id = ?',
  deleteById: 'DELETE FROM route where id=?',
}
