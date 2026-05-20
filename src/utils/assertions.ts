import { expect } from '@playwright/test';

export function sortStringsAscending(values: readonly string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function sortStringsDescending(values: readonly string[]): string[] {
  return sortStringsAscending(values).reverse();
}

export function sortNumbersAscending(values: readonly number[]): number[] {
  return [...values].sort((left, right) => left - right);
}

export function sortNumbersDescending(values: readonly number[]): number[] {
  return [...values].sort((left, right) => right - left);
}

export function expectStringsSortedAscending(values: readonly string[]): void {
  expect(values).toEqual(sortStringsAscending(values));
}

export function expectStringsSortedDescending(values: readonly string[]): void {
  expect(values).toEqual(sortStringsDescending(values));
}

export function expectNumbersSortedAscending(values: readonly number[]): void {
  expect(values).toEqual(sortNumbersAscending(values));
}

export function expectNumbersSortedDescending(values: readonly number[]): void {
  expect(values).toEqual(sortNumbersDescending(values));
}
