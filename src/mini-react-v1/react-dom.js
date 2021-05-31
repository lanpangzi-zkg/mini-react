function render(vnode, container) {
  const node = createNode(vnode);
  container.appendChild(node);
}
/**
 * @desc 创建节点对象，包括原生DOM, 组件对象
 */
function createNode(vnode) {
  const { type } = vnode;
  let node = null;
  if (typeof type === 'function') {
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
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
  updateNode(node, props);
  return node;
}
/**
 * @desc 更新DOM节点属性
 */
function updateNode(node, props) {
  Object.keys(props)
    .filter(k => k !== 'children')
    .forEach(k => {
      node[k] = props[k];
    });
}
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const comp = new type(props);
  const jsx = comp.render();
  return createNode(jsx);
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
  return createNode(ele);
}
export default {
  render
};
