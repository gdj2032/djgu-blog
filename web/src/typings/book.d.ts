export declare namespace BookService {
  interface IBookItem {
    id: string;
    name: string;
    type: 'txt' | 'epub',
    author: string;
    createTime: number;
    size: number;
    oldPath: string;
    newPath: string;
  }
}