import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableList from './components/TableList';

// import styles from './style.less';

@connect(({ userList }) => ({
  ...userList,
}))
class UserList extends Component {
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
          <TableList />
        </div>
      </Fragment>
    );
  }
}
export default UserList;
