export const DOCUMENT_SQL = {
  queryAll: 'SELECT * FROM document',
  queryLimitOffset: 'SELECT * FROM document LIMIT ?, ?',
  queryLimitOffsetWhere: 'SELECT * FROM document LIMIT ?, ? WHERE ?',
  queryById: 'SELECT * FROM document WHERE id=?;',
  queryByName: 'SELECT * FROM document WHERE name=?;',
  insert: 'INSERT INTO document (id, name, description, content, types, createTime, updateTime) VALUES(?,?,?,?,?,?,?);',
  update: 'UPDATE document SET ? WHERE id = ?',
  deleteById: 'DELETE FROM document where id=?',
}
