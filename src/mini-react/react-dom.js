function render(vnode, container) {
  const node = updateNode(vnode);
  container.appendChild(node);
}
function updateNode(vnode) {
  const { type } = vnode;
  let node = null;
  if (typeof type === 'function') {
    if (type.prototype.isReactComponent) {
      node = updateClassComponent(vnode);
    } else {
      node = updateFunctionComponent(vnode);
    }
  } else if (typeof type === 'string') {
    node = updateHostComponent(vnode);
  } else {
    node = updateTextComponent(vnode);
  }
  reconcileChildren(vnode, node);
  return node;
}
/**
 * @desc 原生标签
 */
function updateHostComponent(vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);
  Object.keys(props)
    .filter(k => k !== 'children')
    .forEach(k => {
      node[k] = props[k];
    });
  return node;
}
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const comp = new type(props);
  const jsx = comp.render();
  return updateNode(jsx);
}
/**
 * @desc 编译子节点对象
 */
function reconcileChildren(vnode, parentNode) {
  if (vnode.props && vnode.props.children) {
    const {
      props: { children }
    } = vnode;
    const childrenQueue = Array.isArray(children) ? children : [children];
    childrenQueue.forEach(child => {
      render(child, parentNode);
    });
  }
}
function updateTextComponent(text) {
  return document.createTextNode(text);
}
function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const ele = type(props);
  const node = updateNode(ele);
  return node;
}
export default {
  render
};
