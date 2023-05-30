import { store } from "@/stores"

export const USER_ROLE = {
  superAdmin: '99',
  common: '1',
  isAdmin: (r) => r === USER_ROLE.superAdmin,
  isAdminForSelf: () => store.getState()?.user?.role === USER_ROLE.superAdmin,
  isLogin: () => !!store.getState()?.user?.id,
  options: () => [
    { label: '普通用户', value: USER_ROLE.common },
    { label: '超级管理员', value: USER_ROLE.superAdmin },
  ],
  toString: (t) => USER_ROLE.options().find((e) => e.value === t)?.label,
}

export const USER_TAB = {
  user: '1',
  documentType: '2',
  document: '3',
}
