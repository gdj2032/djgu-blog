interface IQueryParams {
  name?: string;
  type?: string;
  orderType?: 'see' | 'createTime'
  orderBy?: 'ASC' | 'DESC'
  limit?: number;
  offset?: number;
}

export const DOCUMENT_SQL = {
  queryAll: 'SELECT * FROM document',
  queryLimitOffsetFn: (query?: IQueryParams) => {
    const { name, type, orderBy = 'DESC', orderType = 'createTime', limit, offset } = query || {};
    let info = 'SELECT * FROM document'
    let data: any[] = []
    const where = ' WHERE'
    if (name) {
      info += where;
      info += ' name LIKE ? OR description LIKE ?'
      data = [`%${name}%`, `%${name}%`]
    }
    if (type) {
      if (name) {
        info += ' AND'
      } else {
        info += where;
      }
      info += ` FIND_IN_SET(?, types)`
      data.push(type)
    }
    const lim = ` ORDER BY ${orderType} ${orderBy} LIMIT ?, ?`
    info += lim;
    data = data.concat([offset, limit])
    return { sql: info, data }
  },
  queryLimitOffset: 'SELECT * FROM document LIMIT ?, ?',
  queryLimitOffset2: 'SELECT * FROM document WHERE name LIKE ? OR description LIKE ? AND types HAVING ? ORDER BY see DESC LIMIT ?, ?',
  queryById: 'SELECT * FROM document WHERE id=?',
  queryByName: 'SELECT * FROM document WHERE name=?',
  queryByTypes: 'SELECT * FROM document WHERE FIND_IN_SET(?, types)',
  insert: 'INSERT INTO document (id, name, description, fileId, types, createTime, updateTime, see) VALUES(?,?,?,?,?,?,?,?)',
  update: 'UPDATE document SET ? WHERE id = ?',
  deleteById: 'DELETE FROM document where id=?',
}
