interface IQueryParams {
  name?: string;
  routeId?: string;
  orderType?: 'see' | 'createTime'
  orderBy?: 'ASC' | 'DESC'
  limit?: number;
  offset?: number;
}

export const DOCUMENT_SQL = {
  queryAll: 'SELECT * FROM document',
  queryLimitOffsetFn: (query?: IQueryParams) => {
    const { name, routeId, orderBy = 'DESC', orderType = 'createTime', limit, offset } = query || {};
    let info = 'SELECT * FROM document'
    let data: any[] = []
    const where = ' WHERE'
    if (name) {
      info += where;
      info += ' name LIKE ? OR description LIKE ?'
      data = [`%${name}%`, `%${name}%`]
    }
    if (routeId) {
      if (name) {
        info += ' AND'
      } else {
        info += where;
      }
      info += ` routeId=?`
      data.push(routeId)
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
  queryByRouteId: 'SELECT * FROM document WHERE routeId=?',
  queryByTagId: 'SELECT * FROM document WHERE tagIds in (?)',
  insert: 'INSERT INTO document (id, name, description, fileId, routeId, createTime, updateTime, see, tagIds) VALUES(?,?,?,?,?,?,?,?,?)',
  update: 'UPDATE document SET ? WHERE id = ?',
  deleteById: 'DELETE FROM document where id=?',
}
