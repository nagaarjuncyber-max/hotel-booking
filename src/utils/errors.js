export const toFieldErrors = (e) =>
  Object.fromEntries((e?.errors || []).map((x) => [x.field, x.message]));