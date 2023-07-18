export declare namespace VersionService {

  interface IQueryInfo extends ILimitOffset {
    name?: string;
  }

  interface IListData {
    id: string;
    name: string;
    createTime: string;
    updateTime: string;
    zipPath: string;
  }

  interface ICreateInfo {
    name: string;
    zipPath: string;
    type: number;
  }
}