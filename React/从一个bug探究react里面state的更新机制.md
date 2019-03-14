
最近同事遇到一个react组件延迟渲染的问题，最后发现是由于对状态的更新理解不到位导致。具体问题描述：
<!--more-->
### 问题产生
```
// 在parent.js组件里面有这样的函数以及一个Child的子组件
// 点击按钮触发roleId改变，发起异步请求请求后端得到数据data

<!-- parent.js-->
<Child
    roleId={this.state.roleId}
    data={this.state.data}
/>



<!-- Child.js-->

class Child extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data:null
        }
    }
    
    componentWillMount() {
        this.setState({
            data: this.props.data
        })
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.roleId !==this.props.roleId){
            this.setState({
                data: nextProps.data
            })
        }
    }
    
    ...
    render() {
        return (
        <div>
        {
            this.state.data.map(val=>(<div>{val.name}</div>)) 
        }
        </div>
    }
    
}
```

上面的代码乍一看没有问题，但是当改变roleId的时候，会发现data里面的值没有改变，而且发现改变roleId时候，data改变是上一次的结果，存在延迟（异步）。可以通过chrome里面的react插件查看值的改变是有先后顺序。


结论，因为data是在roleId改变之后异步产生，componentWillReceiveProps在初始化render的时候不会执行，它会在Component接受到新的状态(Props)时被触发（只要父组件重新render就会触发这个函数），也就是说roleId改变的这个时候，data并没有改变。

在react尽量使用纯组件，避免props变成state再进行处理。这里就对state的更新进行浅析。
### 探究一下react里面state的更新策略

react里面state的更新不能通过直接给它赋值的方式改变（保证单向数据流）

```
<!--错误-->
this.state.data = 1
// 绝对不要直接修改this.state，这不仅是一种低效做法，而且很有可能会被之后的操作替换


this.setState({  
  count: this.state.count + 1
});
this.setState({  
  count: this.state.count + 1  // 这里也是错误 获取不到上面得到的最新的count，最终结果可能只显示加了一次1
});

```
通过setState来进行更新,而通过setState连续更新有几种方式：
1. 通过setState函数第二个参数，它是state更新完毕的回调函数

```

setState(nextState, callback) //  callback里面就能拿到nextState中更新的状态值

// 例子
this.setState({  
  count: this.state.count + 1
}, () => {
  this.setState({
    count: this.state.count + 1
  });
});

```
2. 函数方式

nextState也可以是一个function，称为状态计算函数，结构为function(state, props) => newState。这个函数会将每次更新加入队列中，执行时通过当前的state和props来获取新的state。那么上面的例子就可以这样写

```
this.setState((state, props) => {  
  return {count: state.count + 1};
});
this.setState((state, props) => {  
  return {count: state.count + 1};
});
```

3. 通过react生命周期函数
把需要在 setState 更新之后进行的逻辑放在一个合适的生命周期 hook 函数中，比如 componentDidMount 或者 componentDidUpdate 也当然可以解决问题。也就是说 count 第一次 +1 之后，出发 componentDidUpdate 生命周期 hook，第二次 count +1 操作直接放在 componentDidUpdate 函数里面就好啦。

官网里面说State Updates May Be Asynchronous，说明setState的更新并不是都是异步的，具体我们可以看一下这个列子：


setState 方法与包含在其中的执行是一个很复杂的过程，从 React 最初的版本到现在，也有无数次的修改。它的工作除了要更动 this.state 之外，还要负责触发重新渲染，这里面要经过 React 核心 diff 算法，最终才能决定是否要进行重渲染，以及如何渲染。而且为了批次与效能的理由，多个 setState 呼叫有可能在执行过程中还需要被合并，所以它被设计以延时的来进行执行是相当合理的。


setState通过一个队列机制实现state更新。setState调用时，将需要更新的state合并后放入状态队列，而不会立刻更新this.state的（队列机制可以高效的批量更新state）。

1. 当直接修改this.state的值，该state不会被放在状态队列里面，下次调用setState并对状态队列进行合并，就会忽略之前直接被修改的state，造成无法预知的错误。
2. 避免频繁地重复更新state


![image](https://i.loli.net/2018/08/31/5b8917077ad34.jpg)

具体的源码实现如下：


```
<!--ReactBaseClasses.js-->
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function(partialState, callback) {
  ...
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
//setState里调用this.updater的一个方法


<!--ReactFiberClassComponent.js-->

const classComponentUpdater = {
  ...
  enqueueSetState(inst, payload, callback) {
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback, 'setState');
      }
      update.callback = callback;
    }

    enqueueUpdate(fiber, update, expirationTime);  // 加入更新队列
    scheduleWork(fiber, expirationTime);  // 开始安排更新工作
  },
  ...
};


<!--ReactFiberScheduler.js-->
// requestWork is called by the scheduler whenever a root receives an update.
// It's up to the renderer to call renderRoot at some point in the future.
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  addRootToSchedule(root, expirationTime);

  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, false);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpiration(expirationTime);
  }
}



<!-- ReactFiberScheduler.js-->
...
// TODO: Batching should be implemented at the renderer level, not inside
// the reconciler.
function batchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn(a);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}
...

<!--ReactDOMEventListener.js -->
...
export function dispatchEvent(
  topLevelType: DOMTopLevelEventType,
  nativeEvent: AnyNativeEvent,
) {
  if (!_enabled) {
    return;
  }

  const nativeEventTarget = getEventTarget(nativeEvent);
  let targetInst = getClosestInstanceFromNode(nativeEventTarget);
  if (
    targetInst !== null &&
    typeof targetInst.tag === 'number' &&
    !isFiberMounted(targetInst)
  ) {
    // If we get an event (ex: img onload) before committing that
    // component's mount, ignore it for now (that is, treat it as if it was an
    // event on a non-React tree). We might also consider queueing events and
    // dispatching them after the mount.
    targetInst = null;
  }

  const bookKeeping = getTopLevelCallbackBookKeeping(
    topLevelType,
    nativeEvent,
    targetInst,
  );

  try {
    // Event queue being processed in the same cycle allows
    // `preventDefault`.
    batchedUpdates(handleTopLevel, bookKeeping);
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping);
  }
}
...


```


以上实际代码相对复杂，用一段伪代码表示：

```
function interactiveUpdates(callback) {
    isBatchingUpdates = true;  // 先把合成更新标识符设为真
    
    // 执行事件的回调函数，如果里面有调用到setState
    // 则会发生上面所说的情况，先把更新加入更新队列
    // 再先返回不执行更新
    callback();  
    
    isBatchingUpdates = false;
    performSyncWork();  // 开始更新
}

```
### 总结更新策略

在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果，

**就是由 React 控制的事件处理过程 setState 不会同步更新 this.state；**

**在 React 控制之外的情况， setState 会同步更新 this.state！**

控制之外，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。
具体可以查看 [JS Bin](https://jsbin.com/mavolejufi/edit?html,js,console,output)

### 关于setState实现promise化
以上情况说明一般来说setState是异步更新，便会想到用promise来进行包装：


```
function setStatePromise(that, newState) {
    return new Promise((resolve) => {
        that.setState(newState, () => {
            resolve();
        });
    });
}

```
### 关于setState的未来 -- 函数式的setState
引用程墨（《深入浅出的react和redux》的作者）的观点--让setState接受一个函数的API设计很棒！因为这符合函数式编程的思想，让开发者写出没有副作用的函数，我们的函数并不去修改组件状态，只是把“希望的状态改变”返回给React，维护状态这些苦力活完全交给React去做。

```
function increment(state, props) {
  return {count: state.count + 1};
}

// 对于多次调用函数式setState的情况，React会保证调用每次increment时，state都已经合并了之前的状态修改结果。
function incrementMultiple() {
  this.setState(increment);
  this.setState(increment);
  this.setState(increment);
}

// 加入当前this.state.count的值是0，第一次调用this.setState(increment)，传给increment的state参数是0，第二调用时，state参数是1，第三次调用是，参数是2，最终incrementMultiple的效果，真的就是让this.state.count变成了3，这个函数incrementMultiple终于实至名归。

// 在increment函数被调用时，this.state并没有被改变，依然，要等到render函数被重新执行时（或者shouldComponentUpdate函数返回false之后）才被改变
```

关于上面函数式setState，大家可能会想到混用的情况：

```
function incrementMultiple() {
  this.setState(increment);
  this.setState(increment);
  this.setState({count: this.state.count + 1});
  this.setState(increment);
}

// 最后得到的结果是让this.state.count增加了2，而不是增加4。
```
原因：
因为React会依次合并所有setState产生的效果，虽然前两个函数式setState调用产生的效果是count加2，但是半路杀出一个传统式setState调用，一下子强行把积攒的效果清空，用count加1取代。


### 说了这么多，最后总结一下setState的关键点：
1. setState不会立刻改变React组件中state的值；
2. setState通过引发一次组件的更新过程来引发重新绘制；
3. 多次setState函数调用产生的效果会合并。


###### 不过博客里面没有对源码里面重要的一些概念进行梳理，以及一些关键点解读，react的设计哲学等等，请允许下次分享

### 参考：
1. https://www.zhihu.com/question/66749082
2. https://juejin.im/post/5a39de3d6fb9a045154405ec
3. https://juejin.im/entry/58b5285a5c497d00560fa290
4. https://reactjs.org/docs/state-and-lifecycle.html
5. [《深入React技术栈》](https://book.douban.com/subject/26918038/)
6. [react中setState  promise化的探究](https://www.jianshu.com/p/7d2f9e582403)
7. [setState何时同步更新状态](https://zhuanlan.zhihu.com/p/26069727?utm_source=tuicool&utm_medium=referral)