const defineJestConfig = require('@tarojs/test-utils-vue3/dist/jest.js').default

const { resolve } = require('path')

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    // 由于在同一个workspace下，会存在引用差异，正常使用情忽略该配置
    '@tarojs/router$': resolve(__dirname, './node_modules/@tarojs/router'),
    '@tarojs/router/dist/router/stack$':  resolve(__dirname, './node_modules/@tarojs/router/dist/router/stack.js')
  }
})