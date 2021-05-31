//fiber数据结构示意图： https://mmbiz.qpic.cn/mmbiz_png/MpGQUHiaib4ib6btibVSrDVXWnDiczhPIRAsOiaHic6osFXZKxbDMpu4Gvp6nFQZvlpxuicIibMuUuve9JVAkibbDrOt4eEA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1
function render(element, container, callback) {
  legacyRenderSubtreeIntoContainer(element, container, callback);
}
function legacyRenderSubtreeIntoContainer(element, container, callback) {
  let root = container._reactRootContainer;
  if (!root) {
    // 首次渲染
    beginWork(element, container);
  }
}
/**
 * @desc 协调子节点
 */
function reconcileChildren(children, workInProgress) {
  console.log('reconcileChildren', children);
  if (children) {
    const _children = Array.isArray(children) ? children : [children];
    let previous = null;
    for (let i = 0; i < _children.length; i++) {
      let child = _children[i];
      if (typeof child === 'string') {
        // workInProgress.stateNode.appendChild(document.createTextNode(child));
        console.log(workInProgress);
        continue;
      }
      let newFiber = {
        type: child.type,
        stateNode: null,
        child: null,
        sibling: null,
        return: workInProgress,
        props: { ...child.props }
      };
      updateHostComponent(newFiber);
      if (i === 0) {
        // 第一个子节点
        workInProgress.child = newFiber;
      }
      if (previous) {
        previous.sibling = newFiber;
      }
      previous = newFiber;
      // console.log(workInProgress.stateNode, newFiber.stateNode);
      // workInProgress.stateNode.appendChild(newFiber.stateNode);
    }
  }
}
function updateClassComponent(element) {
  const { type, props } = element;
  const instance = new type(props);
  return instance.render();
}
function updateHostComponent(workInProgress) {
  const { type, props } = workInProgress;
  if (!workInProgress.stateNode) {
    if (typeof props.children === 'string') {
      // 文本节点
      workInProgress.stateNode = document.createTextNode(props.children);
    } else {
      workInProgress.stateNode = document.createElement(type);
    }
  }
  reconcileChildren(props?.children, workInProgress);
}
function commmitRoot() {
  // console.log(rootFiber);
}
let rootFiber = null;
let nextUnitOfWork = null;
function beginWork(element, container) {
  rootFiber = nextUnitOfWork = {
    type: element.type,
    key: element.key,
    props: { ...element.props },
    child: null,
    return: null,
    sibling: null,
    stateNode: container
  };
  workLoop(nextUnitOfWork);
}
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const jsx = type(props);
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = jsx;
  }
  if (!props.children) {
    props.children = jsx;
  }
  reconcileChildren(props.children, workInProgress);
}
function performUnitOfWork(workInProgress) {
  // 深度遍历生成fiber
  const { type } = workInProgress;
  if (typeof type === 'function') {
    updateFunctionComponent(workInProgress);
  } else {
    updateHostComponent(workInProgress);
  }
  // 返回下一个fiber
  if (workInProgress.child) {
    return workInProgress.child;
  }
  let nextFiber = workInProgress;
  while (nextFiber) {
    if (workInProgress.sibling) {
      return workInProgress.sibling;
    }
    nextFiber = nextFiber.return;
  }
}
function workLoop(deadline) {
  // while (nextUnitOfWork && deadline.timeRemaining() > 0) {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    commmitRoot(); // 提交阶段，渲染dom到页面
  }
}
// requestIdleCallback(workLoop);

export default {
  render
};
