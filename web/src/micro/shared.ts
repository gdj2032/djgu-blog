import { store } from "@/stores";
import { doLogout } from "@/utils";

// 通信
class Shared {
  /**
   * 获取 user
   */
  public getUser() {
    const state = store.getState();
    return state.user;
  }

  public logout = () => {
    doLogout()
  }
}

const shared = new Shared();
export default shared;