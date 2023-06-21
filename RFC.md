- 提案时间: 2023-06-01
- 影响版本: (3.x)

## 概述

支持开发者开发 Taro 应用时，可以进行组件/应用级别的单元测试，提高代码健壮性。

## 动机

为什么我们要做出这个更改？一般应对什么样的场景？这样做会产生什么结果?

### 统一跨框架的测试工具 API

目前针对组件级别的测试，在使用`react`框架时，可以采用`react-test-renderer`,`vue`框架可以采用`@vue/test-utils`这类官方提供的单元测试工具。
我们可以针对这种情况，在各框架提供的官方测试工具能力基础上进行封装，可以使用一套 api，进行跨框架层面的测试

### 覆盖应用级的测试

为什么：Taro 的入口组件、页面组件都有自身的生命周期。单纯使用 react/vue 框架的 test-utils 无法实现 Taro 生命周期的执行流程。
场景：需要进行路由切换测试、入口/页面组件测试
结果：实现在测试环境下从入口文件开始，模拟完整的 Taro 应用渲染结果

## 使用案例

如果提案新增或更改 API ，需要带上一个基本的代码案例。

### 组件级别

```javascript
// __test__/main/index.test.js
import TestUtils from "@tarojs/test-utils-react";
import Hello from "../../src/components/Hello.tsx";
const testUtils = new TestUtils();
describe("App", () => {
  it("RenderComponent", async () => {
    // React跟Vue相同用法
    await testUtils.mount(Hello, {
      // 配置项
      props: {
        a: 1,
      },
    });
    // 等待页面出现.btn这个节点
    const btn = await testUtils.queries.waitForQuerySelector(".btn");
    // 等待react的渲染更新完成
    await testUtils.act(() => {
      // 触发点击事件
      testUtils.fireEvent.click(btn);
    });
    // 打印渲染结果
    expect(testUtils.html()).toMatchSnapshot();
    // <div class="hello">...
  });
});
```

### 应用级别

```javascript
// __test__/main/index.test.js
import TestUtils from "@tarojs/test-utils-react";
import App from "../../src/app.ts";
const testUtils = new TestUtils();
describe("App", () => {
  it("RenderApp", async () => {
    await testUtils.createApp(App, {
      // 配置项
      // pages: [
      //   'pages/index/index',
      //   'pages/second/index',
      // ]
    });
    // 监听/pages/index/index这个页面路由的onShow生命周期触发
    await testUtils.PageLifecycle.onShow("/pages/index/index");
    // 跳转到第二个页面
    Taro.navigateTo({ url: "/pages/second/index" });
    // 监听/pages/second/index这个页面路由的onShow生命周期触发
    await testUtils.PageLifecycle.onShow("/pages/second/index");
    // 当/pages/second/index触发onShow后，打印页面内容
    expect(testUtils.html()).toMatchSnapshot();
    // <body><div class="taro_router" id="app">...
  });
});
```

## 详细设计

可选，请向一个熟悉 Taro 内部实现的人讲解如何在 Taro 中实现这个功能，或讲解实现这一功能需要什么步骤。

### 1. 框架层、DOM 层的分离设计

参考 Testing Library 的设计思路，将框架层和 dom 层分离；

#### DOM 层负责：节点查询、事件触发的机制

- 提供对于 document 的查询 api，包括类似 puperteer 的 waitFor，监听节点出现
- 提供事件触发的 api，通过 dispatch 事件，触发框架层节点的事件监听响应

#### 框架层负责：组件的挂载和渲染

- 视情况各框架对 dom 层提供的 api 进行自身改造重写
- 暴露 mount 函数挂载组件并渲染到指定的 dom 上，react 可通过 react-dom 来渲染，vue 通过@vue/test-utils 在**jsdom**上渲染

### 2. 生命周期的 hook

劫持 AppInstance、PageInstance 所提供的生命周期函数，往里面加塞监听钩子

### 3. web 和小程序的区分

模拟小程序的渲染及生命周期，采用 h5 的渲染流程来进行测试，主要区别在于

- 工程下的`process.env.TARO_ENV`差异

- 渲染的`@tarojs/component`差异，小程序还是走 webcomponent 的流程，但是在输出渲染结果时，按照将`<taro-view-core>`改写为`<view>`

### 4、运行时预处理

通过 jest 的 transformer，将`@tarojs/taro`指向到`@tarojs/plugin-framework-react/dist/api-loader.js` + `@tarojs/taro-h5`

## 缺陷

我们是不是可以不做这个功能，请考虑：

- 实现这个功能的投入：包括代码的复杂度、代码体积的增加、实现功能投入的人力
- 这个功能是不是不需要 Taro 提供，使用 Taro 的开发者也可以在应用层实现，甚至实现得更好
- 对 Taro 既有惯用开发习惯的影响
- 对已发布版本和现有功能的影响，以及用户进行迁移的成本
- 对其它未有代码实现的 RFC 提案的影响

## 替代选择

还有其他的方案也可以实现这个功能吗？

## 适配策略

如果我们实现了这个提案，有没有什么办法可以帮助开发者更好地适应这个改动？
