export declare namespace DocumentTypeService {
  interface IListData {
    id: string;
    name: string;
    description: string;
    createTime: string;
    updateTime: string;
    user: string;
    imageUrl: string;
  }

  interface ICreateInfo {
    name: string;
    description?: string;
    userId: string;
    imageUrl: string;
  }
}