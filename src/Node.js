import React, { Component, PropTypes, Children } from 'react';

const THREE = require('three');

/*
function mapInPlace(/* argments *//*) {
  var len = arguments.length;
  var dest = arguments[0];
  var f = arguments[len-1];
  var args = new Array();
}
*/


function mapInPlace2Vector3(dest, a, f) {
  dest.x = f(dest.x, a.x, 'x');
  dest.y = f(dest.y, a.y, 'y');
  dest.z = f(dest.z, a.z, 'z');
}
function mapInPlace3Vector3(dest, a, b, f) {
  dest.x = f(dest.x, a.x, b.x, 'x');
  dest.y = f(dest.y, a.y, b.y, 'y');
  dest.z = f(dest.z, a.z, b.z, 'z');
}
function map3V3(a, b, c, f) {
  return new THREE.Vector3( f(a.x, b.x, c.x, 'x'), f(a.y, b.y, c.y, 'y'), f(a.z, b.z, c.z, 'z') );
}

function transform(props) {
  const parentSize = props.parentSize;
  const size = new THREE.Vector3(parentSize.x, parentSize.y, parentSize.z);
  const position = new THREE.Vector3(0, 0, 0);

  if (props.sizeMultiple)
    mapInPlace3Vector3(size, props.parentSize, props.sizeMultiple,
      (size, parent, multiple) => parent * multiple);
  if (props.sizeOffset)
    mapInPlace2Vector3(size, props.sizeOffset,
      (size, offset) => size + offset);
  if (props.sizeExact)
    mapInPlace2Vector3(size, props.sizeExact,
      // originally we tested for typeof number, but Vec3 doesn't allow null
      // should use multiple==0 to get a 0 pixel size, for now.
      (size, exact) => exact!==0 ? exact : size);

  if (props.anchorTo)
    mapInPlace3Vector3(position, props.parentSize, props.anchorTo,
      (position, size, anchor) => position += anchor * size / 2);
  if (props.anchorFrom)
    mapInPlace3Vector3(position, size, props.anchorFrom,
      (position, size, anchor) => position -= anchor * size / 2);
  if (props.anchorOffset)
    mapInPlace2Vector3(position, props.anchorOffset,
      (position, offset) => position += offset);

  return { parentSize: size, position };
}

function addProps(child, props) {
  return React.cloneElement(child, transform(props))
}
class Node extends Component {

  render() {
    const children = this.props.children;
    const computed = transform(this.props);
    console.log('props', this.props);
    console.log('computed', computed);
    const addProps = child => React.cloneElement(child, computed);
    const clonedChildren
      = Children.count(children) === 1
      ? addProps(Children.only(children))
      : Children.map(children, addProps);
    return ( <group position={computed.position}>{clonedChildren}</group> );
  }

}

Node.propTypes = {
  parentSize: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired
};

/*
class MeshNode extends Component {

  render() {
    const computed = transform(this.props);
    const children = this.props.children;
    // TODO, only map Object3D types, perhaps with correct args to avoid warning
    console.log('props', this.props);
    console.log('computed', computed);

    return (
      <mesh position={computed.position} receiveShadow castShadow>
        {
          Children.map(children, child => React.cloneElement(child, {
            width: computed.parentSize.x,
            height: computed.parentSize.y,
            depth: computed.parentSize.z,
//            position: computed.position
          }))
        }
      </mesh>
    );
  }

}
*/

const NodeMesh = ({ parentSize, position, children }) => (
  <mesh receiveShadow castShadow>
    {
      Children.map(children, child => React.cloneElement(child, {
        width: parentSize.x,
        height: parentSize.y,
        depth: parentSize.z,
      }))
    }
  </mesh>
);

export { transform, NodeMesh };
export default Node;
