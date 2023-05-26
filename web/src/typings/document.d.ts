export declare namespace DocumentService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    content: string;
    createTime: string;
    updateTime: string;
    types: IIdName[]
    see: number;
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    content: string;
    types: string[];
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
    types?: string;
  }
}