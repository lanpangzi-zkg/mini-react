//fiber数据结构示意图： https://mmbiz.qpic.cn/mmbiz_png/MpGQUHiaib4ib6btibVSrDVXWnDiczhPIRAsOiaHic6osFXZKxbDMpu4Gvp6nFQZvlpxuicIibMuUuve9JVAkibbDrOt4eEA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1
function render(element, container, callback) {
  legacyRenderSubtreeIntoContainer(element, container, callback);
}
function legacyRenderSubtreeIntoContainer(element, container, callback) {
  let root = container._reactRootContainer;
  if (!root) {
    // 首次渲染
    beginWork(element);
  }
}
function createNode(element, parentFiber) {
  // vnode->fiber
  const { type, props } = element;
  let vnode = null;
  if (typeof type === 'function') {
    vnode = type.prototype.isReactComponent
      ? updateClassComponent(element)
      : updateFunctionComponent(element);
  }
  const fiber = {
    type: type,
    stateNode: vnode,
    child: null,
    sibling: null,
    return: parentFiber,
    props: props
  };
  reconcileChildren(vnode, fiber);
  return fiber;
}
function reconcileChildren(vnode, parentFiber) {
  const children = vnode?.props?.children;
  if (children) {
    const _children = Array.isArray(children) ? children : [children];
    let previous = null;
    for (let i = 0; i < _children.length; i++) {
      const filber = createNode(_children[i], parentFiber);
      if (i === 0) {
        // 第一个子节点
        parentFiber.child = filber;
      }
      if (previous) {
        previous.sibling = filber;
      }
      previous = filber;
    }
  }
}
function updateClassComponent(element) {
  const { type, props } = element;
  const instance = new type(props);
  return instance.render();
}
function updateHostComponent(element) {
  const { type } = element;
  return document.createElement(type);
}
function updateFunctionComponent(element) {
  const { type, props } = element;
  return type(props);
}
function commmitRoot() {
  // fiber -> node
}
function beginWork(element) {
  let current = createNode(element);
  console.log(current);
  // workLoop(current);
}

function performUnitOfWork(workInProgress) {}

function workLoop(workInProgress) {
  requestIdleCallback(deadline => {
    while (workInProgress && deadline.timeRemaining() > 0) {
      workInProgress = performUnitOfWork(workInProgress);
    }
    if (!workInProgress) {
      commmitRoot(); // 提交阶段，渲染dom到页面
    }
  });
}

export default {
  render
};
