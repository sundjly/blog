*Author：sundjly*

*Date：2018年11月10日*

### 前言
咦！又一个萌新打开了我，恭喜你，看完之后可以帮助你更好的接手这个项目，从此走上人生巅峰，赢取。。。。（咳咳，醒醒吧 ，少年郎，这是不可能的，最多以后改需求，改bug舒服一点！）皮一下很开心😄😄。

为什么要写这个，可能大家都会遇到过这样的场景：

1. 与团队数个开发者编写一个应用，期间一切工作良好。
2. 客户要求添加新功能。
3. 客户要求删除一些功能，并添加一个新功能。程序开始变得复杂，但你淡然置之。程序即使不完美，但仍然可以运行。
4. 客户再次要求更改和删除一些功能，并添加一个超出预期的功能。此时，你拿起透明胶带开始修补程序。当然，你并不以此为豪，尽管依然能运行。
5. 在接下来的 6 个月内，程序又经过数次迭代。代码的可读性变得非常差，犹如意大利面条。

然后你就会思考，我在哪？我是谁？。。。。
为了避免这样的情况的，在一开始的时候，就得有一个规范，保证风格的统一。方便扩展与查看，一句话就是为了保证可读性！

### 介绍
这篇md就主要介绍了react中项目组织结构，命名路由的方式，以及antd中样式配置的问题。（可以坐在小板凳上慢慢看看）


#### 一 react，redux项目结构划分
redux中结构划分：目前主要有3中形式，不过并没有一个十全十美形式，具体根据项目判断选择，这里我们选择的是按照功能进行划分
##### 1. 按照类型

这里的类型指的是一个文件在项目中充当的角色类型，一般分为component,container,action,reducer等不同角色的文件，分别放在不同的文件夹下，这是redux官网示例所采用的项目结构：

```
/src
  /actions
    /notifications.js
      
 /components 
    /Header
    /Footer
    /Notifications
      /index.js
  /containers
    /Home
    /Login
    /Notifications
      /index.js
  /images
    /logo.png
  /reducers 
    /login.js
    /notifications.js
  /styles 
    /app.scss
    /header.scss 
    /home.scss
    /footer.scss
    /notifications.scss
  /utils
  index.js  
```
开发一个功能时，你需要频繁的切换路径，修改不同的文件。当项目逐渐变大时，这种项目结构是非常不方便的。

##### 2. 按照功能

一个功能模块对应一个文件夹，这个功能所用到的container、component、action、reducer等文件，都存放在这个文件夹下，如下所示：

```
components/
    ...一些公共组件
containers/
    /feature1/
      components/ ...属于container抽取出来的模块，如果其他地方有复用，则应该把它继续抽取相同的部分放到上面的components/中
      actions.js
      container.js
      index.js
      reducer.js
    /feature2/
      components/
      actions.js
      container.js
      index.js
      reducer.js
index.js
rootReducer.js
```
一个功能中使用到的组件、状态和行为都在同一个文件夹下，方便开发，易于功能的扩展;
但是这种方式Redux会将整个应用的状态作为一个store来管理，不同的功能模块之间可以共享store中的部分状态（项目越复杂，这种场景就会越多），于是当你在feature1的container中dispatch一个action，很可能会影响feature2的状态，因为feature1和feature2共享了部分状态，会响应相同的action。这种情况下，不同模块间的功能被耦合到了一起。而且每次都要创建reducer.js actions.js 也还是比较繁琐的

##### 3. [Ducks](https://note.youdao.com/)

提倡将相关联的reducer、action types和action写到一个文件里。本质上是以应用的状态作为模块的划分依据，而不是以界面功能作为划分模块的依据。
管理相同的状态的依赖都在同一个文件中，方便引入文件使用，可以看一下github上的例子，如下：

```
// widget.js

// Actions
const LOAD   = 'widget/LOAD';
const CREATE = 'widget/CREATE';
const UPDATE = 'widget/UPDATE';
const REMOVE = 'widget/REMOVE';

const initialState = {
  widget: null,
  isLoading: false,
}

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    LOAD: 
      //...
    CREATE:
      //...
    UPDATE:
      //...
    REMOVE:
      //...
    default: return state;
  }
}

// Action Creators
export function loadWidget() {
  return { type: LOAD };
}

export function createWidget(widget) {
  return { type: CREATE, widget };
}

export function updateWidget(widget) {
  return { type: UPDATE, widget };
}

export function removeWidget(widget) {
  return { type: REMOVE, widget };
}

```
整体的结构目录就可以写成：
```
components/  (应用级别的通用组件)
containers/  
  feature1/
    components/  (功能拆分出的专用组件)
    feature1.js  (容器组件)
    index.js     (feature1对外暴露的接口)
redux/
  index.js (combineReducers)
  module1.js (reducer, action types, actions creators)
  module2.js (reducer, action types, actions creators)
index.js
```
当container需要使用actions时，可以通过

```
import * as actions from 'path/to/actions.js
<!--当然actions中除了包含Action Creators，还有Actions types和reducer，
如果不想引入所有的，可以把action creators和action types定义到一个命名空间中，解决这个问题-->

// widget.js

// Actions
export const types = {
  LOAD   : 'widget/LOAD',
  CREATE : 'widget/CREATE',
  UPDATE : 'widget/UPDATE',
  REMOVE : 'widget/REMOVE'
}

const initialState = {
  widget: null,
  isLoading: false,
}

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    types.LOAD: 
      //...
    types.CREATE:
      //...
    types.UPDATE:
      //...
    types.REMOVE:
      //...
    default: return state;
  }
}

// Action Creators
export const actions = {
  loadWidget: function() {
    return { type: types.LOAD };
  },
  createWidget: createWidget(widget) {
    return { type: types.CREATE, widget };
  },
  updateWidget: function(widget) {
    return { type: types.UPDATE, widget };
  },
  removeWidget: function(widget) {
    return { type: types.REMOVE, widget };
  }
}

```
因为react的灵活性，并没有强制要求以何种类型进行目录划分，个人感觉后面两种对大项目友好一点，只要项目统一用某种风格就行，避免多种风格的切换导致的后期维护问题。



#### 二 项目中命名规范
上面对结构进行探讨，采用根据功能划分，在src的目录就会有comtainers目录和components目录

```
src
├─ components // 会把所有的组件都放在 components 目录下，除了页面。
└─ containers // 
```
##### 1. 在 components 目录下，我们通过模块/特性(module/feature)的结构来组织文件。


**对于一个通用组件，有一句话，最好的组件是对外只提供一种功能（组件的最小的粒度）**
比如对于一个user组件，里面有form和list，那就应该继续划分：

```
src
└─ components
  └─ User
    ├─ Form
    │ ├─ Form.jsx
    │ └─ Form.css
    └─ List.jsx
    <!--测试用的文件和被测试的文件放在一起，在上面这个例子中，Form.jsx 的测试文件会放在同一个文件夹下并且命名为 Form.spec.jsx-->
```

除了通过模块拆分组件，我们还会在 src/components 放置一个 UI 目录，用于存放所有通用的组件（不包含任何特定应用的业务逻辑）。常见的这类组件有：按钮，输入框，复选框，下拉选择，模态框，数据可视化组件等等。

##### 2. 组件命名
组件命名一般遵循驼峰式，把业务功能，模块加入其中 ，命名时要考虑：

- 组件的命名在应用中应当清晰且唯一，这样可以让它们可以轻松被找到并且避免可能的困惑。
- 当应用在运行时发生错误或者通过 React 开发者工具调试时，组件的名字是非常方便易用的，因为错误发生的地方往往都伴随着组件的名字。

这里我们采用了**基于路径的组件命名方式，即根据相对于 components 文件目录的相对路径来命名**
如果在此文件夹以外，则使用相对于 src 目录的路径。举个例子，组件的路径如果是 components/User/List.jsx，那么它就被命名为 UserList。

如果文件名和文件目录名相同，我们不需要重复这个名字。也就是说，components/User/Form/Form.jsx 会命名为 UserForm 而不是 UserFormForm。

###### 优点：
- 便于在项目中搜索文件：模糊搜索和目录树中搜索文件
- 可以避免在引入时重复名称。根据组件的上下文环境来命名文件，列如： User 模块下的 form 组件，不需要在 form 组件的文件名上重复 user 这个单词，而是使用 Form.jsx 

```
<!--最初使用 React 的时候喜欢用完整的名字来命名文件  出现了MonitoringEquipmentControlContainer，但是这样会导致相同的部分重复太多次，同时引入时的路径太长--> 
import ScreensUserForm from './screens/User/UserForm';
// vs
import ScreensUserForm from './screens/User/Form';


import MediaPlanViewChannel from '/MediaPlan/MediaPlanView/MediaPlanViewChannel.jsx';
// vs
import MediaPlanViewChannel from './MediaPlan/View/Channel';
<!--就可以明显的看到差距，上面的命名重复太多了，作为一个萌新，是万万不能忍受重复这么多的！-->
```

- 页面：对于使用 react-router中项目中也有优势，进行路由跳转我们需要在一个router.js定义所有的路由（也不用全部放在一个文件中），采用了路径的命名方式，path中就可以直接使用。这样url就可以和项目中目录统一起来，看一眼 url 就能够轻松定位当前路由渲染的页面。

```
<!--目录结构-->
src
├─ components 
└─ screens（相当于Containers）
  └─ User
    ├─ Form.jsx    --- 用户表单页面
    └─ List.jsx    --- 用户列表页面
<!--router.js-->
import React, { Component } from 'react';
import { Router } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import ScreensUserForm from './User/Form';
import ScreensUserList from './User/List';

const ScreensRoot = () => (
  <Router>
    <Switch>
      <Route path="/user/list" component={ScreensUserList} />
      <Route path="/user/create" component={ScreensUserForm} />
      <Route path="/user/:id" component={ScreensUserForm} />
    </Switch>
  </Router>
);

export default ScreensRoot;
```
###### 总结一下：
- 通过模块/特性（module/feature）的方式组织组件
- 基础的 UI 组件放在 src/components/UI 目录下
- 保持页面简单，使用最简洁的结构和代码
- 通过路由定义组织页面。对于 /user/list 路由地址来说，我们会有一个页面在 /src/screens/User/List.jsx
- 组件由相对 components 或 src 的路径命名，就是说，处于 src/components/User/List.jsx 位置的组件会被命名为 UserList。处于 src/screens/User/List.jsx 位置的组件会被命名为 ScreensUserList
- 组件和目录同名时，不要在使用组件的时候重复这个名字。考虑这样一个场景，处于 src/components/User/List/List.jsx 位置的组件会被命名为 UserList 而不是 UserListList

### 三 redux中reducer的实践
Redux 是一个用于管理应用状态的出色工具。它的单向数据流和 immmutable state 特色让我们更容易追踪状态的变更。每一个状态的变更都是由被调度的 action 引起 reducer 函数返回新的状态而产生的。
reducer就是实现(state, action) => newState的纯函数，也就是真正处理state的地方。

最理想的情况，通过异步请求获取到的数据，可以直接渲染到页面上，到现实是残酷，就需要我们对数据进行转化，转化的操作可以放在action，reducer，组件的render函数中

```
<!--在action中对数据进行处理-->
// 求第一个数组中没有第二个数组中部分的值
function differenceSecond(m, n) {
  let a = [...m, ...n];
  let b = n;
  let aHasNaN = m.some(function(v) {
    return isNaN(v);
  });
  let bHasNaN = n.some(function(v) {
    return isNaN(v);
  });
  let difference = a
    .filter(function(v) {
      return b.indexOf(v) == -1 && !isNaN(v);
    })
    .concat(
      b.filter(function(v) {
        return a.indexOf(v) == -1 && !isNaN(v);
      })
    )
    .concat(aHasNaN ^ bHasNaN ? [NaN] : []);
  return difference;
}

export const DECLingerCameraIds = (
  decCameraIds,
  cameraIdsAll = []
) => dispatch => {
  let cameraIds = cameraIdsAll;
  cameraIds = cameraIds.map(val => {
    return val.toString();
  });
  // cameraIds = _.pullAll(cameraIds, decCameraIds);   // 对数据进行处理
  cameraIds = differenceSecond(cameraIds, decCameraIds);  // 对数据进行处理
  dispatch({
    type: types.ADD_LINGER_ANALYSIS_CAMERAIDS,
    payload: {
      cameraIds: cameraIds
    }
  });
};

<!--在reducer中对数据进行处理-->
 switch(action.type){
     case types.ADD_DEC_UPLOADFACELIST:
      //删除选中项
      state.uploadFaceList.splice(
        state.uploadFaceList.findIndex(
          item => item.faceId == action.payload.dec.faceId
        ),
        1
      );
      let idsArray = state.ids.split(',');
      idsArray.splice(
        idsArray.findIndex(item => item == action.payload.dec.faceId),
        1
      );
      let dataTypeArray = state.dataType.split(',');
      dataTypeArray.splice(
        dataTypeArray.findIndex(item => item == action.payload.dec.dataType),
        1
      );
      return {
        ...state,
        uploadFaceList: [...state.uploadFaceList],
        //交并集
        mergeType: idsArray.length > 1 ? state.mergeType : 0,
        ids: idsArray.join(','),
        //重置第一次检索状态
        isFirstSearch: idsArray.length > 0,
        //检索统计结果清除
        statisticData: null,
        cameraIds: idsArray.length == 0 ? [] : cameraIds,
        dataType: dataTypeArray.join(',')
      };
  }
```

这里给出最佳实践：**应该在reducer中对数据进行处理，尽量确保props中保存的数据能直接用于组件的render，把数据处理放在reducer中处理，有利于对操作方法的抽象，因为大多数数据处理的操作都是对原有数据的增删改查等，能最大限度的减少冗余代码**

项目中是否写过这样的代码：
```
    case types.ADD_PERSONAL_SEARCH_STATIC_RESULT:
      return {
        ...state,
        ...action.payload
      };
    case types.ADD_PERSONAL_RED_LIMIT:
      return {
        ...state,
        ...action.payload
      };
    case types.ADD_PERSONAL_ANALYSIS_PEER_PARAMS:
      // 同行人员参数设置
      return {
        ...state,
        ...action.payload
      };
    case types.ADD_PERSONAL_RESULT_SORT_CHANGE:
      // 结果排序
      return {
        ...state,
        ...action.payload
      };
```
#### 抽离工具函数
由于reducer都是对state的增删改查，所以会有较多的重复的基础逻辑，针对reducer来抽离工具函数。
要抽离的函数需要满足以下条件：

✦ 纯净，和业务逻辑不耦合

✦ 功能单一，一个函数只实现一个功能

工具函数抽离出来，建议放到单独的文件中保存，列如：src/utils/common.js


#### 抽离 case function 功能函数
直接看例子就明白了

```
// 抽离前，所有代码都揉到slice reducer中，不够清晰
function appreducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TODO':
            ...
            ...
            return newState;
        case 'TOGGLE_TODO':
            ...
            ...
            return newState;
        default:
            return state;
    }
}

// 抽离后，将所有的state处理逻辑放到单独的函数中，reducer的逻辑格外清楚
function addTodo(state, action) {
    ...
    ...
    return newState;
}
function toggleTodo(state, action) {
    ...
    ...
    return newState;
}
function appreducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return addTodo(state, action);
        case 'TOGGLE_TODO':
            return toggleTodo(state, action);
        default:
            return state;
    }
}
```
case function就是指定action的处理函数，是最小粒度的reducer。
抽离case function，可以让slice reducer的代码保持结构上的精简。

#### slice reducer拆分状态
生产环境中一般时间rootReducer拆分成了多个，用对应的slice reducer去处理对应的数据，比如article相关的数据用articlesReducer去处理，paper相关的数据用papersReducer去处理。

这样保证数据之间解耦，并且让每个slice reducer保持代码清晰并且相对独立。然后通过redux的combineReducers函数进行合并。

#### 解决多个slice reducer间共享数据

举例子：我们异步获取article的时候，会附带将comments也带过来，那么我们在articlesReducer中怎么去维护这份comments数据？

```
// 不好的方法
// 我们通过两次dispatch来分别更新comments和article
// 缺点是：slice reducer之间严重耦合，代码不容易维护
dispatch(updateComments(comments));
dispatch(updateArticle(article)));

```
更好的方法：

```

// 定义一个crossReducer
function crossReducer(state, action) {
    switch (action.type) {
        // 处理指定的action
        case UPDATE_COMMENTS:
            return Object.assign({}, state, {
                // 这儿是关键，相当于透传到commentsReducer，然后让commentsReducer去处理对应的逻辑。
                // 这样的话
                // crossReducer不关心commentsReducer的逻辑
                // articlesReducer也不用去关心commentsReducer的逻辑
                comments: commentsReducer(state.comments, action)
            });
        default:
            return state;
    }
}

let combinedReducer = combineReducers({
    entities: entitiesreducer,
    articles: articlesReducer,
    papers: papersReducer
});

// 在其他reducer处理完成后，在进行crossReducer的操作
function rootReducer(state, action) {
    let tempstate = combinedReducer(state, action),
        finalstate = crossReducer(tempstate, action);

    return finalstate;
}
```
我们可以使用reduce-reducers这个插件来简化上面的rootReducer。


```
import reduceReducers from 'reduce-reducers';

export const rootReducer = reduceReducers(
    combineReducers({
        entities: entitiesreducer,

        articles: articlesReducer,
        comments: commentsReducer
    }),
    crossReducer
);

```
#### 减少reducer的样板代码
每次写action/action creator/reducer，都会写很多相似度很高的代码，可以封装一下：

```
// 定义一个createReducer的函数
function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

const todosreducer = createReducer([], {
    'ADD_TODO': addTodo,
    'TOGGLE_TODO': toggleTodo,
    'EDIT_TODO': editTodo
});
```
也可以使用现成的比较好的方案，比如：[redux-actions](https://github.com/redux-utilities/redux-actions)。给个简单的示例，更多的可以查看官方文档。

```
import { createActions, handleActions, combineActions } from 'redux-actions';

const defaultState = { counter: 10 };

const { increment, decrement } = createActions({
  INCREMENT: (amount = 1) => ({ amount }),
  DECREMENT: (amount = 1) => ({ amount: -amount })
});

const reducer = handleActions(
  {
    [combineActions(increment, decrement)]: (
      state,
      { payload: { amount } }
    ) => {
      return { ...state, counter: state.counter + amount };
    }
  },
  defaultState
);

export default reducer;
```




#### reducer的注意点：
- 抽离工具函数，以便复用。
- 抽离功能函数（case function），精简reducer声明部分的代码。
- 通过crossReducer在多个slice reducer中共享数据。
- 减少reducer的模板代码。

### 关于css
这个其实可以放在目录结构里面讲的，不过感觉感觉还是重要，比如开发定制化的时候，甲方不喜欢主题颜色，标题大小改动等等，如果前期没有规划好，也是很爆炸的！

现在项目中都是基于ant-design，因此就会对默认样式进行重新调整，最好有一个统一配置的操作，不用每一处去改动，实现这个诉求是通过--[antd在线换肤定制功能](http://www.cnblogs.com/TaoLand/p/9643232.html)

静态的主题定制：
原理上是使用 less 提供的 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式进行覆盖变量

以 webpack@4 为例进行说明，以下是一个 webpack.config.js 的典型例子，对 less-loader 的 options 属性进行相应配置。

```
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       modifyVars: {
+         'primary-color': '#1DA57A',
+         'link-color': '#1DA57A',
+         'border-radius-base': '2px',
+       },
+       javascriptEnabled: true,
+     },
    }],
    // ...other rules
  }],
  // ...other config
}
```

antd 中可定制的一些css样式，可以查看[这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

#### 全局的样式：关于全局的一些颜色，大小，边距统一现在一个文件里面，写好注释，方便维护，也要按组件划分好
```
<!--目录结构-->
/src
  /styles 
    /app.less
    /header.less 
    /home.less
    /layout.less
    /footer.less
    /menu.less
    /notifications.less
    /variables.less
  /utils
  index.js  
  
  
variables.less----引入index.js文件中，其他用到颜色，大小的统一从这个里面取
  
<!--@import "../../../node_modules/antd/lib/style/themes/default.less";-->
// 基础颜色
@white: #ffffff;
//@primary-color: #36c53e;
@primary-color: #3866ff;
@primary-color-light: fade(lighten(@primary-color, 5%), 15%);
// 导航栏基础背景颜色
@menu-primary-bg: #ffffff;

// 顶部背景色
@layout-header-background:@primary-color;

// 左边菜单light颜色
@layout-sider-background-light: #f9f9f9;

// 字体颜色
@text-color: #000000;
@table-selected-row-bg: #fbfbfb;
@primary-2: #444b65;
// 基础圆角
@border-radius-base: 2px;
// 输入框后缀背景色
@input-addon-bg: @primary-color;

// btn  primary
@border-radius-base: 2px;
@btn-border-radius-base : @border-radius-base;
@btn-border-radius-sm   : @border-radius-base;

@btn-hover-color      : @btn-primary-bg;

// menu的样式
@menu-bg: @menu-primary-bg;
@menu-item-color: @primary-2;
@menu-item-active-color: @btn-primary-bg;
@menu-item-active-bg: rgba(56,102,255,.04);

// LINK
@link-color: @primary-2;
@link-hover-color: @btn-primary-bg;
@link-active-color: @btn-primary-bg;

```
组件自己私有的样式，就和组件放在一个目录下面就好了。


### 总结
以上大体就是项目中一些基本要求，总结一句话，保证代码的清晰干净（隐藏其中的细节，把要做什么描述清楚，而不是具体怎么做！），把重复的东西不断抽象提取，当然也要具体问题具体分析！

在社区中，采用按照功能划分的目录结构，将action和reducer写在一个文件中，并且将redux相关的代码全部放到统一的目录中，即采用了Ducks的形式，这样效率更高一点。

（还没有修改完呀，**大家有什么好的也可以给我反馈！**）


（还没有修改完呀，**大家有什么好的也可以给我反馈！**）




同时建议在添加了一些功能之后，在readme.md里面更新目录结构！

关于构建大型redux的引用大家可以看看[这里翻译](https://zhuanlan.zhihu.com/p/47396514)的建议

### 更新
#### 2019年3月6日  
1. 添加了eslint，prettier验证，
在vs code中结合prettier 也可以实现保存自动格式化 vs code下载插件：eslint和prettier 在setting中加入以下配置
// 注意windows下的路径为两个反斜杠(\\)，其他为(/)
```
{
......
+ "eslint.autoFixOnSave": true,
+ "eslint.options": { "configFile": "你的项目路径 + .eslintrc.json（等配置文件）" }
......
}
```
保存就能自动格式化代码了，
2. 同时配置了git commit  提交时格式化，参考了：https://facebook.github.io/create-react-app/docs/setting-up-your-editor

#### jest
### 参考
- https://github.com/JChehe/blog/issues/19
- https://segmentfault.com/a/1190000010775697
- https://hackernoon.com/structuring-projects-and-naming-components-in-react-1261b6e18d76
- https://techblog.appnexus.com/five-tips-for-working-with-redux-in-large-applications-89452af4fdcb
- https://www.jianshu.com/p/938f8121ba0f
- 单元测试：https://segmentfault.com/a/1190000016828718
- 前端错误收集，统一异常处理：https://juejin.im/post/5be2b0f6e51d4523161b92f0?utm_source=gold_browser_extension
