export declare namespace RouteService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    father_id: string;
    createTime: string;
    user: IIdName;
    role: string;
    path: string;
    children: IListData[]
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    father_id: string;
    role: string;
    path: string;
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
    onlyParent?: boolean;
  }
}