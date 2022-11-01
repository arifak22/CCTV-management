import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    var sys = JSON.parse(localStorage.getItem("sys"));
    return (
      <React.Fragment>
        <span> 2020 &copy;  {sys.apps_name + ' - API version ' + sys.apps_version} </span>
        <span className="ml-auto">Powered by <a href="https://sideveloper.com/">Sideveloper</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
