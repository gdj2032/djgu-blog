export declare namespace Methods {
  export type Get = <T>(req?: import('express').Request, res?: import('express').Response) => T | Promise<T>
  export type Post = <T>(req?: import('express').Request, res?: import('express').Response) => T | Promise<T>
  export type Put = <T>(req?: import('express').Request, res?: import('express').Response) => T | Promise<T>
  export type Delete = <T>(req?: import('express').Request, res?: import('express').Response) => T | Promise<T>
}
