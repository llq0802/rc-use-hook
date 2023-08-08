/**
 * 深克隆
 * @param obj
 * @returns
 */
export const _cloneDeep = (obj: any) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === 'object' ? _cloneDeep(obj[key]) : obj[key]),
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

/**
 * 判断是不是函数
 * @param fn
 * @returns
 */
export function isFunction(fn: unknown) {
  return typeof fn === 'function';
}
