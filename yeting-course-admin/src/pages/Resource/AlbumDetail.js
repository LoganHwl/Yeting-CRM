import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './style.less';

const { Column } = Table;

@connect(({ albumManager }) => ({
  ...albumManager,
}))
class AlbumEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
    };
  }

  componentWillMount() {}
  componentDidMount() {
    let id = this.props.location.query.id;
    if (id) {
      this.setState({
        id,
      });
      this.props.dispatch({
        type: 'albumManager/getAlbumDetail',
        payload: id,
      });
      this.props.dispatch({
        type: 'albumManager/getAlbumDocList',
        payload: { albumId: id },
      });
    }
  }

  render() {
    const detailData = this.props.detailData && this.props.detailData;
    const albumDocData = this.props.albumDocData && this.props.albumDocData;
    const albumDocList = albumDocData && albumDocData.list;
    return (
      <Fragment>
        <PageHeaderWrapper />
        <div className={styles.album_detail_title}>专辑详情</div>
        <div className={styles.album_detail_box}>
          <span className={styles.album_detail_span}>
            专辑名称：
            {detailData.name}
          </span>
          <span className={styles.album_detail_span}>
            专辑ID：
            {detailData.id}
          </span>
          <span className={styles.album_detail_span}>
            专辑类型：
            {detailData.type == 3 ? '音频' : detailData.type == 2 ? '视频' : '图片'}
          </span>
        </div>
        <div className={styles.album_detail_box}>
          <span className={styles.album_detail_span}>
            创建时间：
            {detailData.createTime}
          </span>
          <span className={styles.album_detail_span}>
            资源总数：
            {detailData.ducomentNums}
          </span>
          <span className={styles.album_detail_span}>
            描述：
            {detailData.descr}
          </span>
        </div>
        <Table dataSource={albumDocList} bordered>
          <Column title="资源ID" dataIndex="id" key="id" />
          <Column title="节目名" dataIndex="title" key="title" />
          <Column title="添加时间" dataIndex="createTime" key="createTime" />
          <Column
            title="播放"
            key="url"
            width="100"
            render={item => <audio src={item.url} controls="controls" />}
          />
        </Table>
      </Fragment>
    );
  }
}
export default AlbumEdit;
