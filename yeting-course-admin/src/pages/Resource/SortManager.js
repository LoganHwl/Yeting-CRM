import React, { Component, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SortList from './components/SortList';

class SortManager extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Fragment>
        <PageHeaderWrapper />
        <div>
          <SortList />
        </div>
      </Fragment>
    );
  }
}
export default SortManager;
