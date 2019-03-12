import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import Noty from '../../components/Noty';

import { Input, Button, Table, Select, Modal, Divider, Dropdown, Icon, Menu } from 'antd';

const Option = Select.Option;

// import styles from './style.less';

@connect(({ audioList, loading }) => ({
  ...audioList,
  loading: loading.models.audioList,
}))
class AudioList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.onSearch();
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'audioList/CLEAR_ALL',
    });
  }

  onSearch(page = 1) {
    const { search, pageSize } = this.props;

    this.props.dispatch({
      type: 'audioList/CHANGE_PAGENO',
      startPage: page,
    });

    const params = {
      startPage: page,
      pageSize,
    };

    for (const [key, value] of Object.entries(search)) {
      if (value) {
        params[key] = value;
      }
    }

    this.props.dispatch({
      type: 'audioList/getAudioList',
      payload: params,
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'audioList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  // 删除音频弹框
  audioDelete(record) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content: '删除后已购用户将无法使用，在下方关联的课程列表中也将消失，确认删除吗？',
      okText: '删除',
      cancelText: '取消',
      async onOk() {
        await dispatch({
          type: 'audioList/audioDelete',
          payload: record.id,
        });

        self.onSearch();
      },
      onCancel() {},
    });
  }

  // 上、下架音频弹框
  audioStop(record) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content:
        record.status == 0
          ? '是否上架？'
          : '下架后所有用户都不可查看(播放)到该音频，且不会出现在课程列表中，确认下架吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        await dispatch({
          type: record.status == 0 ? 'audioList/audioOnline' : 'audioList/audioOffline',
          payload: [record.id],
        });

        self.onSearch();
      },
      onCancel() {},
    });
  }

  render() {
    const { loading, pageSize, startPage, audioList, search } = this.props;

    const columns = [
      {
        title: 'ID',
        width: 60,
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '音频名称',
        key: 'title',
        dataIndex: 'title',
      },
      {
        title: '播放数',
        width: 120,
        dataIndex: 'playCount',
        key: 'playCount',
      },
      {
        title: '状态',
        width: 120,
        key: 'status',
        render: (text, record) => {
          let statusName = '';
          switch (record.status) {
            case 0:
              statusName = '下架';
              break;
            case 1:
              statusName = '上架';
              break;
            case 2:
              statusName = '删除';
              break;
            case -1:
              statusName = '状态异常';
              break;
            default:
              break;
          }

          return statusName;
        },
      },
      {
        title: '上架时间',
        width: 120,
        dataIndex: 'activeTime',
        key: 'activeTime',
      },
      {
        title: '关联课程',
        width: 90,
        key: 'course',
        render: (text, record) => {
          return (
            <Dropdown
              overlay={
                <Menu>
                  {record.course.map(item => (
                    <Menu.Item>《{item.name}》</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a href="javascript:;">
                {record.course.length}
                <Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
      {
        title: '操作',
        width: 160,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <Link to={`/audio/audio-list/edit?id=${record.id}`}>编辑</Link>
              <Divider type="vertical" />
              <a onClick={this.audioStop.bind(this, record)}>
                {record.status == 0 ? '上架' : '下架'}{' '}
              </a>
              <Divider type="vertical" />
              <a onClick={this.audioDelete.bind(this, record)}>删除 </a>
            </div>
          );
        },
      },
    ];

    const pagination = {
      total: audioList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    return (
      <Fragment>
        <PageHeaderWrapper />

        <Link to={`/audio/audio-list/edit`}>
          <Button type="primary" style={{ marginTop: 20 }}>
            新建音频
          </Button>
        </Link>
        <div style={{ marginTop: 20 }}>
          <Select
            value={search.status}
            placeholder="选择状态"
            allowClear={true}
            style={{ width: 120, marginBottom: 10, marginRight: 16 }}
            onChange={value => this.onSearchConditionChange({ status: value })}
          >
            <Option value={'0'}>下架</Option>
            <Option value={'1'}>上架</Option>
          </Select>
          <Input
            value={search.title}
            placeholder="输入音频名称"
            style={{ width: 220, marginBottom: 10, marginRight: 16 }}
            onChange={e => this.onSearchConditionChange({ title: e.target.value })}
          />
          <Button
            style={{ marginBottom: 10, marginRight: 16 }}
            type="primary"
            onClick={() => this.onSearch()}
          >
            搜索
          </Button>
        </div>

        <Table
          rowKey={'id'}
          locale={{ emptyText: '没有数据' }}
          columns={columns}
          loading={loading}
          dataSource={audioList.list}
          pagination={pagination}
          bordered
        />
        <Noty />
      </Fragment>
    );
  }
}
export default AudioList;
