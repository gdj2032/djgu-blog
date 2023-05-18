export const getClassName = (key1: string, key2: string) => {
  const cn = key1;
  let str = key1;
  if (key2.includes(' ')) {
    str = ''
    const nArr = key2?.split(' ');
    for (const i of nArr) {
      str += ` ${cn}-${i}`
    }
  } else if (key2) {
    str = `${key1}-${key2}`
  }
  return str;
};
