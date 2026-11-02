import { expect, it, vi } from 'vitest';
import { withRetry } from '../src/retry';
it('retries after exactly 1000 ms', async () => {
  vi.useFakeTimers(); const action = vi.fn().mockRejectedValueOnce(new Error('TIMEOUT')).mockResolvedValue('ok');
  const result = withRetry(action); await vi.advanceTimersByTimeAsync(999); expect(action).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1); await expect(result).resolves.toBe('ok'); expect(action).toHaveBeenCalledTimes(2);
});
it('returns last error after three attempts', async () => {
  vi.useFakeTimers(); const error = new Error('TIMEOUT'); const action = vi.fn().mockRejectedValue(error);
  const assertion = expect(withRetry(action)).rejects.toBe(error);
  await vi.advanceTimersByTimeAsync(2000); await assertion; expect(action).toHaveBeenCalledTimes(3); expect(vi.getTimerCount()).toBe(0);
});
it('immediate success schedules no timer', async () => {
  vi.useFakeTimers(); const action = vi.fn().mockResolvedValue(7);
  await expect(withRetry(action)).resolves.toBe(7); expect(action).toHaveBeenCalledTimes(1); expect(vi.getTimerCount()).toBe(0);
});
it.each([[0, 1], [1.5, 1], [1, -1], [1, Infinity]])('rejects options %s %s', async (attempts, delay) => {
  const action = vi.fn(); await expect(withRetry(action, attempts, delay)).rejects.toThrow('INVALID_RETRY_OPTIONS');
  expect(action).not.toHaveBeenCalled();
});
