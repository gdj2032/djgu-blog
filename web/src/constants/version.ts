export const VERSION_TYPE = {
  web: 0,
  server: 1,
  options: () => [
    { label: 'web', value: VERSION_TYPE.web },
    { label: 'server', value: VERSION_TYPE.server },
  ],
  toString: (t = -1) => VERSION_TYPE.options().find((e) => e.value === t)?.label,
}
