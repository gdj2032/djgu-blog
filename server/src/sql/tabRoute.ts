export const TAB_ROUTE_SQL = {
  queryAll: 'SELECT * FROM tab_route',
  queryLimitOffset: 'SELECT * FROM tab_route LIMIT ?, ?',
  queryLimitOffset2: 'SELECT * FROM tab_route WHERE name LIKE ? OR description LIKE ? ORDER BY see DESC LIMIT ?, ?;',
  queryById: 'SELECT * FROM tab_route WHERE id=?;',
  queryByName: 'SELECT * FROM document WHERE name=?;',
  insert: 'INSERT INTO tab_route (id, name, description, parentId, path, role, userId, createTime) VALUES(?,?,?,?,?,?,?,?);',
  update: 'UPDATE tab_route SET ? WHERE id = ?',
  deleteById: 'DELETE FROM tab_route where id=?',
}
