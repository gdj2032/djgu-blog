import mysql from 'mysql';
import { DATABASE_INFO } from '@/constants';

export default class DataBase {
  pool = mysql.createPool(DATABASE_INFO);

  static database = new DataBase()

  // query('SELECT * FROM user LIMIT ?, ?', [_offset, _limit]);
  // query('SELECT * FROM user WHERE id=?;', [id]);
  // query('INSERT INTO user (id, username, password, role, session, createTime) VALUES(?,?,?,?,?,?);', [])
  // query('UPDATE users SET ? WHERE UserID = ?', [{Name: name}, userId], );

  static sql(sql: string, params?: any): any {
    return new Promise((res) => {
      this.database.pool.query(sql, params, (error, data, fields) => {
        if (error) {
          console.info('--- DataBase.sql error --->', JSON.stringify({ error, sql, params }));
        }
        res({ data, fields, error })
      })
    })
  }
}
