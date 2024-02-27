import { bookAction, store } from "@/stores";
import { BookService } from "@/typings/book";

interface IProps {
  id: string;
  book: BookService.IBookItem
  isInit?: boolean;
}

class ReadBookUtil {
  id: string;
  book: BookService.IBookItem;
  setting: BookService.ISetting;
  constructor({ id, book, isInit = false }: IProps) {
    this.id = id;
    this.book = book;
    this.init(isInit)
  }

  init(isInit?: boolean) {
    this.setting = store.getState().book.setting;
    const bookInfo = window.app.getBook({ filename: this.book.fullName })
    if (bookInfo?.content) {
      store.dispatch(bookAction.setLoading(true))
      const { fontSize, lineHeight } = this.setting
      const ctx0 = bookInfo.content;
      const chapters0 = this.getChapters(ctx0)
      const chapters: BookService.IChapter[] = []
      let ctx = ctx0
      let id = 0;
      let title = '序章'

      if (chapters0.length > 10) {
        for (const cp of chapters0) {
          if (!ctx) continue;
          const ctx2 = ctx.split(cp)
          const content = ctx2[0]
          ctx = ctx2[1]
          const item: BookService.IChapter = {
            id,
            title,
            total: chapters0.length,
            pages: this.getPages({ content, fontSize, lineHeight }),
          }
          chapters.push(item)
          id++;
          title = cp;
        }
        store.dispatch(bookAction.setChapters({ id: this.book.id, chapters }))
        if (isInit) {
          store.dispatch(bookAction.setChapter({ id: this.book.id, chapter: { chapterId: 0, pageId: 0 } }))
        }
      }
      setTimeout(() => {
        store.dispatch(bookAction.setLoading(false))
      }, 300);
    }
  }

  private getChapters(ctx: string) {
    const reg = /(正文){0,1}(第)([零〇一二三四五六七八九十百千万a-zA-Z0-9]{1,7})[章节卷集部篇回]((?! {4}).)((?!\t{1,4}).){0,30}\r?\n/g;
    const res = ctx.match(reg)
    return res
  }

  paddingSize = 48;
  getPages({ content, fontSize, lineHeight }: { content: string, fontSize: number, lineHeight: number }) {
    const texts = content.split('\r\n')
    const pages0: string[][] = []
    const dom = document.getElementById(this.id);
    const w = dom.clientWidth - this.paddingSize;
    const h = dom.clientHeight - this.paddingSize;
    const oneWLineNum = +Math.floor(w / fontSize).toFixed(0);
    const oneHLineNum = +Math.floor(h / lineHeight).toFixed(0);
    console.log("🚀 ~ ReadBookUtil ~ getPages ~ oneHLineNum:", oneHLineNum)
    let pages: string[] = []
    let lh = 0
    for (const t1 of texts) {
      const t2 = t1.replace('\r', '').trim()
      if (!t2) {
        continue;
      }
      if (t2.length <= oneWLineNum) {
        pages.push(t2)
        lh++;
      } else {
        let t3 = ''
        for (const t4 of t2) {
          t3 += t4;
          if (t3.length === oneWLineNum) {
            pages.push(t3)
            t3 = ''
            lh++;
            if (lh >= oneHLineNum) {
              pages0.push(pages)
              lh = 0
              pages = []
            }
          }
        }
        if (t3) {
          pages.push(t3)
          lh++;
        }
      }
      if (lh >= oneHLineNum) {
        pages0.push(pages)
        pages = []
        lh = 0
      }
    }
    if (pages.length > 0) {
      pages0.push(pages)
    }
    return pages0;
  }

}

export default ReadBookUtil;
