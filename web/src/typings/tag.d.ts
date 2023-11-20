export declare namespace TagService {
  interface IListData {
    id: string;
    name: string;
    description?: string;
    createTime?: string;
    user?: IIdName;
    path: string;
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    routeId: string;
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
    routeId?: string;
  }
}