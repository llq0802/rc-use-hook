import { isEqual } from 'lodash-es';
import type { DependencyList } from 'react';

/**
 * 判断深度两个数据是否相等
 * @param aDeps
 * @param bDeps
 * @returns
 */
export const depsEqual = (
  aDeps: DependencyList = [],
  bDeps: DependencyList = [],
) => isEqual(aDeps, bDeps);

/**
 * 判断是不是函数
 * @param fn{*} 需要判断的值
 * @returns
 */
export const isFunction = (fn: unknown) => typeof fn === 'function';

/**
 * 将驼峰字符串以-分割
 * @param str
 * @returns
 */
export function getCamelCase(str: string) {
  return str.replace(/-([a-z])/g, function (all, i) {
    return i.toUpperCase();
  });
}

/**
 * 判断元素是否可滚动
 * @param  HTMLElement dom元素
 * @return boolean
 */
export const isScrollable = function (ele: HTMLElement) {
  const hasScrollableContent = ele?.scrollHeight > ele?.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;

  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

  return hasScrollableContent && !isOverflowHidden;
};

/**
 * 查找当前元素以及父元素直到body 可以滚动的元素
 * @param HTMLElement 元素
 * @returns HTMLElement
 */
export const getScrollableParent = function (ele: HTMLElement): HTMLElement {
  if (!ele || ele === document.body) {
    return document.body;
  } else if (isScrollable(ele)) {
    return ele;
  } else {
    return getScrollableParent(ele?.parentNode);
  }
};

/**
 * 判断是不是苹果Safari浏览器
 */
export const isSafari = () =>
  /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

/**
 * 判断苹果Safari屏幕的方向
 */
export function getScreenOrientation(): 'portrait' | 'landscape' {
  if (window.innerHeight > window.innerWidth) {
    return 'portrait'; // 竖屏
  } else {
    return 'landscape'; // 横屏
  }
}
