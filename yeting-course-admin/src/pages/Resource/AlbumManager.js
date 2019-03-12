import React, { Component, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AlbumList from './components/AlbumList';

class AlbumManager extends Component {
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
          <AlbumList />
        </div>
      </Fragment>
    );
  }
}
export default AlbumManager;
