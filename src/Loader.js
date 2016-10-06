import React, { Component, Children, PropTypes } from 'react';

const resources = new Map();

class Resource {

  constructor(url, loader, dataKey = 'resource') {
    this.instances = new Set();
    this.dataKey = dataKey;
    this.state = { loading: true };

    // If we were given THREE.Loader, instantiate a new THREE.Loader()
    if (loader.prototype)
      loader = new loader();

    loader.load(
      url,
      this.onLoad.bind(this),
      this.onProgress.bind(this),
      this.onError.bind(this)
    );
  }

  addInstance(instance) {
    this.instances.add(instance);
  }

  removeInstance(instance) {
    this.instances.remove(instance);
  }

  setState(object) {
    this.state = { ...this.state, ...object };
    this.instances.forEach(instance => instance.setState(object));
  }

  onLoad(resource) {
    this.setState({
      loading: false,
      [this.dataKey]: resource
    })
  }

  onProgress(xhr) {
    this.setState({
      progress: {
        loaded: xhr.loaded,
        total: xhr.total
      }
    });
  }

  onError(xhr) {
    this.setState({ error: xhr.responseText });
  }

}

/*
class Loader extends Component {

  constructor(props, context, subClassOptions) {
    super(props, context);

    const url = props.url;
    const resourceId = props.resourceId || url;
    const loader = props.loader || subClassOptions.loader;
    const dataKey = this.dataKey = props.dataKey || subClassOptions.dataKey || 'resource';

    const resource = this.resource = resources.get(resourceId) ||
      resources.set(resourceId, new Resource(url, loader, dataKey));

    resource.addInstance(this);
    this.state = resource.state;
  }

  render() {
    return ( <boxGeometry width={1} height={1} depth={1} /> );
    console.log('state', this.state);
    console.log(this.dataKey, this.state[this.dataKey]);
    if (this.state[this.dataKey]) {
      console.log('loaded');
      console.log('direct', this.props.children);
      console.log('only', Children.only(this.props.children));
      console.log('cloned',  React.cloneElement(Children.only(this.props.children), {
        [this.dataKey]: this.state[this.dataKey]
      }));
      return React.cloneElement(Children.only(this.props.children), {
        [this.dataKey]: this.state[this.dataKey]
      });
    }
    console.log('loading');
    //return null;
  }

  componentWillUnmount() {
    this.resource.removeInstance(this);
  }

}

Loader.propTypes = {
  url: PropTypes.string.isRequired,
  loader: PropTypes.string,
  children: PropTypes.element,
  resourceId: PropTypes.string,
  dataKey: PropTypes.string,
};
*/

function Loader(url, loader, resultsKey, Component) {
  return class Loader extends React.Component {
    constructor(props, context) {
      super(props, context);

      const resource = this.resource = resources.get(url) ||
        resources.set(url, new Resource(url, loader, 'object'));

      resource.addInstance(this);
      this.state = resource.state;
    }

    render() {
      const props = { ...this.props, [resultsKey]: this.state };
      return ( <Component {...props} /> );
    }
  }
}

export { Resource };
export default Loader;
