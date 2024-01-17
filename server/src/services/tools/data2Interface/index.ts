import fs from 'fs'
import path from 'path'
import os from 'os'

const txtPath = path.resolve(__dirname, './demo.ts')

const commonBlack = 2

const getBlack = (n: number) => {
  let s = '';
  for (let i = 0; i < n / 2; i++) {
    s += ' ';
  }
  return s;
}

const getArray = (n: number) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    s += '[]';
  }
  return s;
}

const array2Interface = (key: string, value: any[], blank: number, i: number) => {
  if (value.length === 0) {
    fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': string[];${os.EOL}`, { encoding: 'utf-8' });
    return;
  }
  let value2 = value;
  const type0 = Object.prototype.toString.call(value2[0])
  if (type0 === '[object Object]') {
    value2 = [value.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur,
      }
    }, {})]
  }
  for (const item of value2) {
    const type1 = Object.prototype.toString.call(item)
    if (type1 === '[object Number]') {
      fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': number${getArray(i)};${os.EOL}`, { encoding: 'utf-8' });
    } else if (type1 === '[object String]') {
      fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': string${getArray(i)};${os.EOL}`, { encoding: 'utf-8' });
    } else if (type1 === '[object Object]') {
      fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': {${os.EOL}`, { encoding: 'utf-8' });
      object2InterfaceFn('', item, blank + 2)
      fs.appendFileSync(txtPath, `${getBlack(blank)}}${getArray(i)}${os.EOL}`, { encoding: 'utf-8' });
    } else if (type1 === '[object Array]') {
      array2Interface(key, item, blank, i + 1)
    }
    break;
  }
}

const object2InterfaceFn = (key: string, value: any, blank: number) => {
  const type = Object.prototype.toString.call(value)
  // console.log('🚀 ~ file: index.ts:46 ~ object2Interface ~ value:', key, value, type)
  if (type === '[object String]') {
    // 字符串
    fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': string;${os.EOL}`, { encoding: 'utf-8' });
  } else if (type === '[object Number]') {
    // 数字
    fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': number;${os.EOL}`, { encoding: 'utf-8' });
  } else if (type === '[object Array]') {
    // 数组
    array2Interface(key, value, blank, 1);
  } else if (type === '[object Object]') {
    // 对象
    if (Object.keys(value).length === 0) {
      fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': Object${os.EOL}`, { encoding: 'utf-8' });
      return;
    }
    if (key) {
      fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': {${os.EOL}`, { encoding: 'utf-8' });
    }
    for (const k in value) {
      const val = value[k];
      object2InterfaceFn(k, val, blank + 2)
    }
    if (key) {
      fs.appendFileSync(txtPath, `${getBlack(blank)}}${os.EOL}`, { encoding: 'utf-8' });
    }
  } else if (type === '[object Null]' || type === '[object Undefined]') {
    fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': string;${os.EOL}`, { encoding: 'utf-8' });
  } else if (type === '[object Boolean]') {
    fs.appendFileSync(txtPath, `${getBlack(blank)}'${key}': boolean;${os.EOL}`, { encoding: 'utf-8' });
  }
}

const data2Interface = (foo: any) => {
  fs.writeFileSync(txtPath, 'interface IDemo {' + os.EOL, { encoding: 'utf-8' });
  object2InterfaceFn('', foo, commonBlack)
  fs.appendFileSync(txtPath, '}', { encoding: 'utf-8' });

  return fs.readFileSync(txtPath).toString();
}

export default data2Interface;
