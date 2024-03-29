export const USER_ROLE = {
  superAdmin: '99',
  common: '1',
  isAdmin: (r) => r === USER_ROLE.superAdmin,
  options: () => [
    { label: '普通用户', value: USER_ROLE.common },
    { label: '超级管理员', value: USER_ROLE.superAdmin },
  ],
  toString: (t) => USER_ROLE.options().find((e) => e.value === t)?.label,
}
