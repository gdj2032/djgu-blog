import { __DEV__ } from "@/constants";
import shared from "./shared";

// 主应用的Router Basename，如果没有则不需要修改
window.__YUNA_MAIN_BASENAME__ = '';

const generateActiveRule = (route: string) => {
  const { pathname } = window.location
  return `${pathname}#${window.__YUNA_MAIN_BASENAME__}${route}`
}

const yunaMicroSubAdminENntry = !__DEV__
  ? 'http://dev3.tmindtech.com:8223/demo/index.html'
  : 'http://localhost:10000'

const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用，这里我们使用 config 配置
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   * props: 主应用需要传递给微应用的数据
   */
  {
    name: 'react-admin-template',
    entry: yunaMicroSubAdminENntry,
    container: '#micro-app',
    activeRule: generateActiveRule('/react-admin-template'),
    props: {
      shared,
    }
  },
];

export default apps;
