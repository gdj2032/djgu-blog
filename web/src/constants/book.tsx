import { isNaN } from "lodash";

export const BOOK_BG_COLOR = {
  colors: [
    '#FF703250',
    '#FFC14150',
    '#8CD24C50',
    '#4CD2B050',
    '#59BCF350',
    '#607AFB50',
    '#CC60FB50',
    '#FB608850',
    '#E1888C50',
    '#A1609C50',
    '#6F60A150',
    '#6075A150',
    '#609FA150',
    '#60A16250',
    '#97A16050',
    '#C0A67A50',
  ],
  getBg: (id: string) => {
    if (id) {
      const idx = (+id) % BOOK_BG_COLOR.colors.length;
      if (!isNaN(idx)) {
        return BOOK_BG_COLOR.colors[idx];
      }
    }
    return BOOK_BG_COLOR.colors[0];
  }
}

// 字体大小
export const BOOK_FONT_SIZE = {
  min: 10,
  max: 40,
  step: 2,
  sizes() {
    const arr: number[] = [];
    const len = (BOOK_FONT_SIZE.max - BOOK_FONT_SIZE.min) / BOOK_FONT_SIZE.step;
    for (let i = 0; i <= len; i++) {
      arr.push(BOOK_FONT_SIZE.min + BOOK_FONT_SIZE.step * i)
    }
    return arr;
  }
}
