export declare namespace FileSql {

  interface IAddFile {
    id: string;
    filename: string;
    url: string;
    createTime: string;
    mimeType: string;
    persistenceStorage: number;
  }

  interface IFile extends IAddFile {
  }

}
