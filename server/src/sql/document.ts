export const DOCUMENT_SQL = {
  queryAll: 'SELECT * FROM document',
  queryLimitOffset: 'SELECT * FROM document LIMIT ?, ?',
  queryLimitOffset2: 'SELECT * FROM document WHERE name LIKE ? OR description LIKE ? ORDER BY see DESC LIMIT ?, ?;',
  queryById: 'SELECT * FROM document WHERE id=?;',
  queryByName: 'SELECT * FROM document WHERE name=?;',
  insert: 'INSERT INTO document (id, name, description, content, types, createTime, updateTime, see) VALUES(?,?,?,?,?,?,?,?);',
  update: 'UPDATE document SET ? WHERE id = ?',
  deleteById: 'DELETE FROM document where id=?',
}
