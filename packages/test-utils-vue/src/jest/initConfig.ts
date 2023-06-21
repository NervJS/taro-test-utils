import { DEFAULT_Components } from '@tarojs/runner-utils'

import { resolve } from 'path'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export default {
  bail: 1,
  verbose: false,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    customExportConditions: ['node', 'node-addons']
  },
  testMatch: ['<rootDir>/__test__/**/*.test.{js,ts}'],
  setupFiles: [resolve(__dirname, './jest.setup.js')],
  collectCoverageFrom: [
    '<rootDir>/__test__/**/*.{js,ts}',
    '!**/__test__/**'
  ],
  transform: {
    '^.+\\.(vue)$': '@vue/vue2-jest',
    '^.+\\.(js|jsx|ts|tsx)$': resolve(__dirname, './babel-transformer.js')
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
    'jsx',
    "vue"
  ],
  moduleNameMapper: {
    '@tarojs/taro$': resolve(__dirname, './runtime/taro-h5.js'),
    '@tarojs/components$': '@tarojs/components/lib/vue2/index'
  },
  globals: {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    DEPRECATED_ADAPTER_COMPONENT: false,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    __TARO_FRAMEWORK__: 'vue',
    'vue-jest': {
      compilerOptions: {
        nodeTransforms: [(node) => {
          if (node.type === 1) {
            const nodeName = node.tag
            if (DEFAULT_Components.has(nodeName)) {
              node.tag = `taro-${nodeName}`
              node.tagType = 1 /* 0: ELEMENT, 1: COMPONENT */
            }
          }
        }],
        isCustomElement: tag => {
          return /^taro-/.test(tag) || tag === 'root' || tag === 'block'
        }
      }
    }
  },
}