export const DOCUMENT_TYPE_SQL = {
  queryAll: 'SELECT * FROM documentType',
  queryLimitOffset: 'SELECT * FROM documentType LIMIT ?, ?;',
  queryById: 'SELECT * FROM documentType WHERE id=?;',
  queryByIds: 'SELECT * FROM documentType WHERE id in (?);',
  queryByName: 'SELECT * FROM documentType WHERE name=?;',
  insert: 'INSERT INTO documentType (id, name, description, createTime, updateTime, userId, imageUrl) VALUES(?,?,?,?,?,?,?);',
  update: 'UPDATE documentType SET ? WHERE id = ?',
  deleteById: 'DELETE FROM documentType where id=?',
}