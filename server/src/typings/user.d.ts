export declare namespace UserSql {

  interface IRegisterInfo {
    username: string;
    password: string;
    role: string;
    session?: string;
    createTime: number;
  }

  interface IUpdateSessionInfo {
    id: string;
    session: string;
    loginTime: number;
  }

}
