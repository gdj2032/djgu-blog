/* tslint:disable:no-empty */
const noop = () => { };

function genQuery(params?: IRequestParams) {
  if (!params) {
    return '';
  }
  let index = 0;
  let query = '';
  Object.keys(params).forEach((name) => {
    if (params[name] !== undefined && params[name] !== null) {
      query += (index === 0 ? '?' : '&');
      const value = params[name];
      query += `${name}=${value}`;
      index += 1;
    }
  });
  return query;
}

/**
 * 允许超时中止的Promise
 * @param {Promise} basePromise
 * @param {number} timeout
 */
const abortablePromise = (basePromise: Promise<any>, timeout: number = 20000) => {
  let abortFunc: () => void = null;

  const abortPromise = new Promise((_, reject) => {
    abortFunc = () => {
      reject('request timeout');
    };
  });

  const newPromise = Promise.race([
    basePromise,
    abortPromise
  ]);

  setTimeout(() => {
    abortFunc();
  }, timeout);

  return newPromise;
}

/**
 * 应用权限适配方法
 */
const adaptPermission: (data: Array<{ applicationId: number; permissionId: number; id: number }>) => any = (data: Array<{ applicationId: number; permissionId: number; id: number }>) => {
  const DataPermission = [];
  (data || []).forEach(element => {
    const idx = DataPermission.findIndex(v => v.applicationId === element.applicationId);
    if (idx !== -1) {
      DataPermission[idx].permissionIds.push(element.permissionId);
    } else {
      DataPermission.push({
        applicationId: element.applicationId,
        permissionIds: [element.permissionId]
      });
    }
  });
  return DataPermission;
}

/**
 * 检测应用appCode是否符合 仅数字和字母
 * @param v
 */
const checkAppManagerCode = (v: any) => {
  const reg = /^[A-Za-z]+[A-Za-z0-9]*$/;
  return reg.test(v)
}

/**
 * 检测应用permissionCode是否符合 仅数字和字母
 * @param v
 */
const checkPermissionCode = (v: any) => {
  const reg = /^[.a-zA-Z0-9]*$/;
  return reg.test(v)
}

interface ITreeInfo {
  id: any;
  name: any;
  parentId: any; //父id，没有父id时为0
  type: any;
  children: ITreeInfo[];
  key?: any; //需要添加的
}

/**
 * 数组节点children为[]改为null
 * 添加key值
 * @param data
 */
const checkChildrenAddKey = (arr: ITreeInfo[], parentItem?: ITreeInfo) => {
  arr.forEach(ele => {
    ele.key = parentItem ? `${parentItem.key}_${ele.id}` : `${ele.id}`
    if (ele.children && ele.children.length > 0) {
      return checkChildrenAddKey(ele.children, ele)
    } else {
      ele.children = null;
    }
  })
  return arr;
}

export {
  noop,
  genQuery,
  abortablePromise,
  adaptPermission,
  checkAppManagerCode,
  checkPermissionCode,
  checkChildrenAddKey,
};
