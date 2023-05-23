// 用户
export const USER_SQL = {
  queryAll: 'SELECT * FROM user',
  queryLimitOffset: 'SELECT * FROM user LIMIT ?, ?;',
  queryById: 'SELECT * FROM user WHERE id=?;',
  queryByName: 'SELECT * FROM user WHERE username=?;',
  insert: 'INSERT INTO user (id, username, password, role, session, createTime) VALUES(?,?,?,?,?,?);',
  updateSession: 'UPDATE user SET session = ?, loginTime = ? WHERE id = ?',
  deleteById: 'DELETE FROM user where id=?',
}
