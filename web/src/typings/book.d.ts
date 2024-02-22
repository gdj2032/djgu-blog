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

  interface IChapter {
    // 第几章 从0开始(序章)
    id: number;
    // 章节名称
    title: string;
    // 总章节
    total: number;
    // 章节页
    pages: string[][]
  }

  interface IChapterPageId {
    chapterId: number;
    pageId: number;
  }

  interface ISetting {
    fontSize: number;
    lineHeight: number;
    background: string;
    color: string;
  }

  interface ISetting2 {
    fontSize?: number;
    lineHeight?: number;
    background?: string;
    color?: string;
  }
}
