export const RequestMapping = (path: string): ClassDecorator => {
  return function (target) {
    target.prototype.url = path
  }
}
