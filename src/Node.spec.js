import chai from 'chai';
import { mount, shallow } from 'enzyme';

import React from 'react';
const THREE = require('three');

import Node, { transform } from './Node';

const should = chai.should();

describe('transform', () => {

  describe('size', () => {

    it('transforms size proportionally by multiple', () => {
      transform({
        parentSize: new THREE.Vector3(100, 100, 100),
        sizeMultiple: new THREE.Vector3(0.5, 1, 2)
      }).parentSize.toArray().should.deep.equal([ 50, 100, 200 ]);
    });

    it('transforms size by offset', () => {
      transform({
        parentSize: new THREE.Vector3(100, 100, 100),
        sizeOffset: new THREE.Vector3(-50, 0, +50)
      }).parentSize.toArray().should.deep.equal([ -50, 0, +50 ]);
    });

    it('transforms exact size', () => {
      transform({
        parentSize: new THREE.Vector3(100, 100, 100),
        sizeExact: new THREE.Vector3(-50, 0, +50)
      }).parentSize.toArray().should.deep.equal([ -50, 0, +50 ]);
    });

    it('transforms size by multiple, offset and explicit', () => {
      transform({
        parentSize: new THREE.Vector3(100, 100, 100),
        sizeMultiple: new THREE.Vector3(0.5, 2, 100),
        sizeOffset: new THREE.Vector3(-50, 50, 50),
        sizeExact: new THREE.Vector3(null, null, 300)
      }).parentSize.toArray().should.deep.equal([ 0, 250, 300 ]);
    });

  });

  describe('position', () => {

    it('anchorOffset', () => {
      transform({
        parentSize: new THREE.Vector3(200, 200, 200),
        sizeExact: new THREE.Vector3(100, 100, 100),
        anchorOffset: new THREE.Vector3(-50, 0, 50)
      }).position.toArray().should.deep.equal([ -50, 0, 50 ]);
    });

    it('anchorTo', () => {
      transform({
        parentSize: new THREE.Vector3(200, 200, 200),
        sizeExact: new THREE.Vector3(100, 100, 100),
        anchorTo: new THREE.Vector3(-1, 0, 1)
      }).position.toArray().should.deep.equal([ -100, 0, 100 ]);
    });

    it('anchorFrom', () => {
      transform({
        parentSize: new THREE.Vector3(200, 200, 200),
        sizeExact: new THREE.Vector3(100, 100, 100),
        anchorFrom: new THREE.Vector3(-1, 0, 1)
      }).position.toArray().should.deep.equal([ 50, 0, -50 ]);
    });

    it('everthing', () => {
      transform({
        parentSize: new THREE.Vector3(200, 200, 200),
        sizeExact: new THREE.Vector3(100, 100, 100),
        anchorFrom: new THREE.Vector3(-1, 0, 1),
        anchorTo: new THREE.Vector3(-1, 0, 1),
        anchorOffset: new THREE.Vector3(-20, 0, 20)
      }).position.toArray().should.deep.equal([ -70, 0, 70 ]);
    });

  });

});

const Leaf = () => ( <div>hi</div> );

describe('Node', () => {

  it('transforms props', () => {
    const parentSize = new THREE.Vector3(100, 100, 100);

    const wrapper = shallow(
      <Node parentSize={parentSize}>
        <Leaf />
      </Node>
    );

    const leaf = wrapper.at(0).props();
    leaf.parentSize.toArray().should.deep.equal([ 0, 0, 0 ]);
    leaf.position.toArray().should.deep.equal([ 0, 0, 0 ]);
  });

});
