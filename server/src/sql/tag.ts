interface IQueryParams {
  name?: string;
  routeId?: string;
  orderType?: 'createTime'
  orderBy?: 'ASC' | 'DESC'
  limit?: number;
  offset?: number;
}

export const TAG_SQL = {
  queryAll: 'SELECT * FROM tag',
  queryLimitOffset: 'SELECT * FROM tag WHERE routeId=? ORDER BY createTime LIMIT ?, ?',
  queryLimitOffsetFn: (query?: IQueryParams) => {
    const { name, routeId, orderBy = 'DESC', orderType = 'createTime', limit, offset } = query || {};
    let info = 'SELECT * FROM tag'
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
  queryById: 'SELECT * FROM tag WHERE id=?',
  queryByParentTagId: 'SELECT * FROM tag WHERE parentTagId=?',
  queryByIds: 'SELECT * FROM tag WHERE id in (?)',
  queryByName: 'SELECT * FROM tag WHERE name=?',
  queryByRouteId: 'SELECT * FROM tag WHERE routeId=?',
  insert: 'INSERT INTO tag (id, name, description, routeId, parentTagId, createTime, updateTime, userId) VALUES(?,?,?,?,?,?,?,?)',
  update: 'UPDATE tag SET ? WHERE id = ?',
  deleteById: 'DELETE FROM tag where id=?',
}
