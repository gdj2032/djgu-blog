import mysql from 'mysql';
import { DATABASE_INFO } from '@/constants';
import { RESPONSE_CODE_MSG, RESPONSE_TYPE } from '@/utils';

export default class DataBase {
  pool = mysql.createPool(DATABASE_INFO);

  static database = new DataBase()

  static sql(sql: string, params: any = []): any {
    return new Promise((res) => {
      this.database.pool.query(sql, params, (error, data, fields) => {
        console.info('--- DataBase.sql --->', error, data);
        res({ data, fields, error })
      })
    })
  }
}
