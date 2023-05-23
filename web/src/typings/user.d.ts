export declare namespace UserService {
  interface ILoginParams {
    username: string;
    password: string;
  }

  interface IResetPasswordInfo {
    password: string,
    oldPassword: string,
  }

  interface IResetMyPsdInfo {
    oldPassword: string;
    password: string;
  }

  interface IListData {
    id: string;
    username: string;
    role: string;
    createTime: string;
    loginTime: string;
  }
}
