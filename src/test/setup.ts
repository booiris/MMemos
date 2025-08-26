import { vi } from 'vitest'

// Mock Tauri APIs
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn()
}))

vi.mock('@tauri-apps/plugin-fs', () => ({
  BaseDirectory: {
    AppCache: 'AppCache'
  },
  exists: vi.fn(),
  mkdir: vi.fn(),
  readFile: vi.fn(),
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
  writeFile: vi.fn()
}))

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn()
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    path: '/',
    name: 'home'
  }))
}))

// Mock Vue I18n
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key),
    locale: { value: 'en' }
  }))
}))

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}
