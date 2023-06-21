// @ts-nocheck
import path from 'path'
import { createTransformer } from 'babel-jest';
import apiLoader from '@tarojs/plugin-framework-react/dist/api-loader.js';
import '@jest/transform';


const transform = createTransformer({
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }],
    ["@babel/preset-env", {
      "modules": "commonjs"
    }],
    ["@babel/preset-react"],
    '@babel/preset-typescript'
  ]
});

const oldProcess = transform.process;

transform.process = (sourceText, sourcePath, options) => {
  // 劫持替换 @tarojs/taro => tarojs/taro-h5 + react runtime
  if (sourcePath.includes('test-utils-react/dist/jest/runtime/taro-h5.js')) {
    sourceText = apiLoader(sourceText)
  }
  // TODO: 无法对组件库内的判断处理，可能会有问题
  // 劫持工程文件，把process.env.TARO_ENV替换为对应的运行时方便进行判断
  if (sourcePath.startsWith(path.join(process.cwd(), 'src'))) {
    sourceText = sourceText.replace(/process\.env\.TARO_ENV/g, "process.env.TARO_ENV_JEST || process.env.TARO_ENV");
  }
  return oldProcess(sourceText, sourcePath, options);
};

export default transform;
