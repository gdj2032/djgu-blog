
const PadZero = (str) => {
  return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
}

export const formatTime = (seconds: number, showSeconds?: boolean) => {
  const hours = parseInt(`${seconds / 3600}`, 10);
  const mins = parseInt(`${seconds % 3600 / 60}`, 10);
  const sec = parseInt(`${seconds % 60}`, 10);

  if (showSeconds) {
    return `${PadZero(hours)}:${PadZero(mins)}:${PadZero(sec)}`;
  }

  return `${PadZero(hours)}:${PadZero(mins)}`;
}

export const getElementLeft = (element) => {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

export const getElementTop = (element) => {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
