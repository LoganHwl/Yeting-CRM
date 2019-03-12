import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Noty from '../../components/Noty';
import moment from 'moment';

import { DatePicker, Input, Button, Table, Select, Icon, message } from 'antd';

const { RangePicker } = DatePicker;

// import styles from './style.less';

@connect(({ messageList, loading }) => ({
  ...messageList,
  loading: loading.models.messageList,
}))
class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentWillMount() {
    const curDate = new Date();
    const preData = moment(new Date(curDate.getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');
    await this.onSearchConditionChange({ startTime: preData, endTime: preData });
    this.onSearch();
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'messageList/CLEAR_ALL',
    });
  }

  onSearch(page = 1) {
    const { search, pageSize } = this.props;

    this.props.dispatch({
      type: 'messageList/CHANGE_PAGENO',
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
      type: 'messageList/getMessageList',
      payload: params,
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'messageList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  render() {
    const { loading, pageSize, startPage, messageList, search } = this.props;
    const curDate = new Date();

    const columns = [
      {
        title: '日期',
        key: 'time',
        dataIndex: 'time',
      },
      {
        title: '消息名称',
        dataIndex: 'messageName',
        key: 'messageName',
      },
      {
        title: '消息类型',
        dataIndex: 'messageType',
        key: 'messageType',
      },
      {
        title: '总推送人数',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '推送成功人数',
        dataIndex: 'success',
        key: 'success',
      },
      {
        title: '推送失败人数',
        dataIndex: 'error',
        key: 'error',
      },
    ];

    const pagination = {
      total: messageList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    return (
      <Fragment>
        <PageHeaderWrapper />
        <div style={{ backgroundColor: 'white', paddingTop: 10 }}>
          <RangePicker
            defaultValue={[
              moment(new Date(curDate.getTime() - 24 * 60 * 60 * 1000)),
              moment(new Date(curDate.getTime() - 24 * 60 * 60 * 1000)),
            ]}
            style={{ width: 350, marginBottom: 10, marginRight: 16 }}
            onChange={(data, dataString) =>
              this.onSearchConditionChange({ startTime: dataString[0], endTime: dataString[1] })
            }
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
          dataSource={messageList.list}
          pagination={pagination}
          bordered
        />

        <Noty />
      </Fragment>
    );
  }
}
export default MessageList;
