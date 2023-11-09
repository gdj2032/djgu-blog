export declare namespace RouteService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    parentId: string;
    createTime: string;
    user: IIdName;
    role: string;
    path: string;
    children: IListData[]
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    parentId: string;
    role: string;
    path: string;
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
  }
}