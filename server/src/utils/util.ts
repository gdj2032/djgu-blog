import moment from "moment";

export function getQuery(url: string): any {
  try {
    const theRequest = new Object();
    if (url.indexOf('?') !== -1) {
      const str = url.split('?');
      const strs = str?.[1]?.split("&") || [];
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  } catch (error) {
    console.info('--- getQuery error --->', error);
  }
  return {}
}

export function randomKey() {
  return Math.random().toString(16).slice(2);
}

export const userUuid = () => {
  const time1 = moment().valueOf().toString()
  const time2 = process.hrtime.bigint().toString().slice(2)
  const s = `${time1}${time2}`
  return s;
}

export const fileUuid = () => {
  const time1 = moment().valueOf().toString()
  const time2 = process.hrtime.bigint().toString().slice(3)
  const s = `${time1}${time2}`
  return s;
}

export const documentUuid = () => {
  const time1 = moment().valueOf().toString()
  const time2 = process.hrtime.bigint().toString().slice(4)
  const s = `${time1}${time2}`
  return s;
}

export const documentTypeUuid = () => {
  const time1 = moment().valueOf().toString()
  const time2 = process.hrtime.bigint().toString().slice(5)
  const s = `${time1}${time2}`
  return s;
}

export const commonUuid = () => {
  const time1 = moment().valueOf().toString()
  const time2 = process.hrtime.bigint().toString().slice(8)
  const s = `${time1}${time2}`
  return s;
}
