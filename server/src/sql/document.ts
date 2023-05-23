export const DOCUMENT_SQL = {
  queryAll: 'SELECT * FROM document',
  queryLimitOffset: 'SELECT * FROM document LIMIT ?, ?;',
  queryById: 'SELECT * FROM document WHERE id=?;',
  queryByName: 'SELECT * FROM document WHERE name=?;',
  insert: 'INSERT INTO document (id, name, description, content, createTime, updateTime) VALUES(?,?,?,?,?,?);',
  update: 'UPDATE document SET ? WHERE id = ?',
  deleteById: 'DELETE FROM document where id=?',
}
