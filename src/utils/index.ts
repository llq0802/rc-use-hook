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
