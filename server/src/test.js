// const mysql = require('mysql')

// const DATABASE_INFO = {
//   host: 'localhost',
//   user: 'root',
//   password: '12345678',
//   database: 'Blog',
//   port: 3306,
// };

// class DataBase {
//   pool = mysql.createPool(DATABASE_INFO);

//   static database = new DataBase()

//   // query('SELECT * FROM user LIMIT ?, ?', [_offset, _limit]);
//   // query('SELECT * FROM user WHERE id=?;', [id]);
//   // query('INSERT INTO user (id, username, password, role, session, createTime) VALUES(?,?,?,?,?,?);', [])
//   // query('UPDATE users SET ? WHERE UserID = ?', [{Name: name}, userId], );

//   static sql(sql, params) {
//     return new Promise((res) => {
//       this.database.pool.query(sql, params, (error, data, fields) => {
//         // console.info('--- DataBase.sql --->', error, data);
//         res({ data, fields, error })
//       })
//     })
//   }
// }

// async function test() {
//   const res = await DataBase.sql('SELECT * FROM document LIMIT ?, ?', [0, 10])
//   console.log("🚀 ~ file: test.js:26 ~ test ~ res:", res)
// }

// test()
