import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { coverage: { provider: 'v8', include: ['src/parking.ts', 'src/delivery.ts'], reporter: ['text', 'html', 'json-summary'], thresholds: { branches: 90 } } } });
