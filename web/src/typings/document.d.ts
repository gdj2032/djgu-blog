export declare namespace DocumentService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    fileId: string;
    createTime: string;
    updateTime: string;
    types: IIdName[]
    see: number;
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    fileId: string;
    types: string[];
  }

  interface IQueryInfo extends ILimitOffset {
    name?: string;
    types?: string;
    latest?: boolean;
  }
}