export declare namespace TagService {
  interface IListData {
    id: string;
    name: string;
    description?: string;
    createTime?: string;
    user: IIdName;
    route: IIdName;
    parentTag?: IListData

    // tier存在
    children?: IListData[]
    title?: string;
    key?: string;
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

  interface IQueryTierInfo {
    name?: string;
    routeId?: string;
  }
}