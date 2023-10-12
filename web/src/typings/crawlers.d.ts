export declare namespace CrawlersService {

  interface IListData {
    id: string;
    name: string;
    url: string;
  }

  interface IDownloadInfo {
    id: string;
    url: string;
    firstPage: number;
    lastPage: number;
  }
}
