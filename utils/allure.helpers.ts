import { allure } from 'allure-playwright';

/**
 * Wraps a block in an Allure step with a given name.
 */
export async function step<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return allure.step(name, fn as () => Promise<void>) as unknown as Promise<T>;
}

/**
 * Attach a plain text note to the Allure report.
 */
export async function attachNote(name: string, body: string): Promise<void> {
  await allure.attachment(name, body, 'text/plain');
}

/**
 * Tag the current test (e.g. 'smoke', 'regression').
 */
export function tag(...tags: string[]): void {
  allure.tags(...tags);
}

/**
 * Set test severity (blocker | critical | normal | minor | trivial).
 */
export function severity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
  allure.severity(level);
}

/**
 * Group by feature for Allure behaviour tree.
 */
export function feature(name: string): void {
  allure.feature(name);
}

/**
 * Group by story for Allure behaviour tree.
 */
export function story(name: string): void {
  allure.story(name);
}

/**
 * Epic label — populates "Stability distribution by epics" and "Coverage diff map".
 */
export function epic(name: string): void {
  allure.epic(name);
}

/**
 * Layer label — populates "Testing pyramid" and "Durations by layer histogram".
 * Typical values: 'unit' | 'integration' | 'e2e' | 'api'
 */
export function layer(value: string): void {
  allure.label('layer', value);
}

/**
 * Assign test owner — visible in test detail panel.
 */
export function owner(name: string): void {
  allure.owner(name);
}

/**
 * Add a plain-text description to the test.
 */
export function description(text: string): void {
  allure.description(text);
}
