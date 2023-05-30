// 用户
export const FILE_SQL = {
  queryAll: 'SELECT * FROM file',
  queryById: 'SELECT * FROM file WHERE id=?;',
  insert: 'INSERT INTO file (id, url, used, createTime) VALUES(?,?,?,?);',
  update: 'UPDATE file SET ? WHERE id = ?',
  updateByUrl: 'UPDATE file SET ? WHERE url = ?',
  deleteById: 'DELETE FROM file where id=?',
}
