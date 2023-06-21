import type { Config as Config_2 } from '@jest/types';
import initConfig from './initConfig.js';
export declare type Config = Config_2.InitialOptions;


export default function defineJestConfig(config: Config) {
  const { globals, moduleNameMapper, ...otherConfig } = config
  const finalConfig = Object.assign({}, initConfig, otherConfig)
  if (globals) {
    Object.assign(finalConfig.globals, globals)
  }
  if (moduleNameMapper) {
    Object.assign(finalConfig.moduleNameMapper, moduleNameMapper)
  }
  return finalConfig
}