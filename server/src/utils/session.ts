import DataBase from '@/db';
import { USER_SQL } from '@/sql';
const sessionKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678abcdefghijklmnopqrstuvwxyz'
// 加密
export const jCode = function (value) {
  const kleng = sessionKey.length;
  const kstr = sessionKey.split("");
  let v = "", cat, cat1, cat2, cat3;
  for (let i = 0; i < value.length; i++) {
    cat = value.charCodeAt(i);
    cat1 = cat % kleng;
    cat = (cat - cat1) / kleng;
    cat2 = cat % kleng;
    cat = (cat - cat2) / kleng;
    cat3 = cat % kleng;
    v += kstr[cat3] + kstr[cat2] + kstr[cat1];
  }
  return v;
}
// 解密
export const zCode = function (value) {
  const kleng = sessionKey.length;
  let alen, cat1, cat2, cat3, num = 0, arr;
  arr = new Array(Math.floor(value.length / 3));
  alen = arr.length;
  for (let i = 0; i < alen; i++) {
    cat1 = sessionKey.indexOf(value.charAt(num));
    num++;
    cat2 = sessionKey.indexOf(value.charAt(num));
    num++;
    cat3 = sessionKey.indexOf(value.charAt(num));
    num++;
    arr[i] = cat1 * kleng * kleng + cat2 * kleng + cat3
  }
  alen = eval("String.fromCharCode(" + arr.join(',') + ")");
  return alen;
}

// 获取session
export const getSession = ({ id, username, loginTime }) => {
  return jCode(JSON.stringify({ id, username, loginTime }))
}

// 解析session
export const getUserIdNameBySession = (s = '') => {
  return zCode(s)
}

//keys可以任意，不小于34个字符。

// 设置保存session
export const setSession = async ({ id, session, loginTime }) => {
  await DataBase.sql(USER_SQL.updateSession, [session, loginTime, id])
}
