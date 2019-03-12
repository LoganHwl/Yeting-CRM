import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

// import styles from './style.less';

@connect(({ taskList }) => ({
  ...taskList,
}))
class TaskList extends Component {
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
      </Fragment>
    );
  }
}
export default TaskList;
