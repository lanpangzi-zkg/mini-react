//fiber数据结构示意图： https://mmbiz.qpic.cn/mmbiz_png/MpGQUHiaib4ib6btibVSrDVXWnDiczhPIRAsOiaHic6osFXZKxbDMpu4Gvp6nFQZvlpxuicIibMuUuve9JVAkibbDrOt4eEA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1
function render(element, container, callback) {
  legacyRenderSubtreeIntoContainer(element, container, callback);
}
function legacyRenderSubtreeIntoContainer(element, container) {
  let root = container._reactRootContainer;
  if (!root) {
    // 首次渲染
    beginWork(element, container);
  }
}
function createNode(element) {
  const { type, props } = element;
  if (typeof element.type === 'string') {
    const node = document.createElement(type);
    Object.keys(props)
      .filter(v => v !== 'children')
      .forEach(k => (node[k] = props[k]));
    return node;
  }
  return null;
}
/**
 * @desc 协调子节点
 */
function reconcileChildren(children, workInProgress) {
  if (children) {
    const _children = Array.isArray(children) ? children : [children];
    let previous = null;
    for (let i = 0; i < _children.length; i++) {
      let child = _children[i];
      if (typeof child === 'string') {
        // 文本节点
        workInProgress.stateNode.appendChild(document.createTextNode(child));
        continue;
      }
      let newFiber = {
        type: child.type,
        stateNode: createNode(child),
        child: null,
        sibling: null,
        return: workInProgress,
        props: { ...child.props }
      };
      if (i === 0) {
        // 第一个子节点
        workInProgress.child = newFiber;
      }
      if (previous) {
        previous.sibling = newFiber;
      }
      previous = newFiber;
      if (newFiber.stateNode) {
        let parentFiber = workInProgress;
        while (parentFiber && !parentFiber.stateNode) {
          parentFiber = parentFiber.return;
        }
        parentFiber.stateNode.appendChild(newFiber.stateNode);
      }
    }
  }
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
  console.log('commmitRoot', rootFiber);
  let child = rootFiber.child;
  while (child && !child.stateNode) {
    child = child.child;
  }
  rootFiber.stateNode.appendChild(child.stateNode);
}
let rootFiber = null;
let nextUnitOfWork = null;
function beginWork(element, container) {
  nextUnitOfWork = rootFiber = {
    // 初始化根节点
    type: '__root__',
    props: null,
    children: { ...element },
    return: null,
    sibling: null,
    stateNode: container
  };
}
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  reconcileChildren(type(props), workInProgress); // 将一级子节点的fiber生成好
}
function updateRootComponent(workInProgress) {
  const { children } = workInProgress;
  reconcileChildren(children, workInProgress);
}
function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  reconcileChildren(new type(props).render(), workInProgress);
}
function performUnitOfWork(workInProgress) {
  // 深度遍历生成fiber
  const { type } = workInProgress;
  if (typeof type === 'function') {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress);
  } else if (type === '__root__') {
    updateRootComponent(workInProgress);
  } else {
    updateHostComponent(workInProgress);
  }
  // 返回下一个fiber
  if (workInProgress.child) {
    return workInProgress.child;
  }
  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    commmitRoot(); // 提交阶段，渲染dom到页面
  }
}
requestIdleCallback(workLoop);

export default {
  render
};
