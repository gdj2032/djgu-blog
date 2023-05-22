import mysql from 'mysql';
import { DATABASE_INFO } from '@/constants';
import { RESPONSE_CODE_MSG, RESPONSE_TYPE } from '@/utils';

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
        // console.info('--- DataBase.sql --->', error, data);
        res({ data, fields, error })
      })
    })
  }
}
