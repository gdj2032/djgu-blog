export declare namespace DocumentService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    fileId: string;
    createTime: string;
    updateTime: string;
    route: IIdNamePath
    tags: IIdName[]
    see: number;
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    fileId: string;
    routeId: string;
    tagIds: string[];
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
    routeId?: string;
    tagId?: string;
  }
}