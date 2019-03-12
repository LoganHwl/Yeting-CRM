import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Table, Input, Select, Divider, Button, message, Modal } from 'antd';
import styles from '../style.less';

const confirm = Modal.confirm;
const { Column } = Table;

@connect(({ taskList }) => ({
  ...taskList,
}))
class TableList extends Component {
  constructor(props) {
    super(props);

    this.handleInputIdChange = this.handleInputIdChange.bind(this);
    this.handleInputTitleChange = this.handleInputTitleChange.bind(this);
    this.handleInputStateChange = this.handleInputStateChange.bind(this);
    this.handleInputAuthorChange = this.handleInputAuthorChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handlePush = this.handlePush.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.showConfirm = this.showConfirm.bind(this);

    this.state = {
      checkList: [],
      selectedRowKeys: [],
      recordId: '',
      recordTitle: '',
      recordState: '',
      author: '',
      startPage: 1,
    };
  }

  componentWillMount() {
    // this.getList(1);
    this.handleSearch(1);
  }
  componentWillUnmount() {}

  // 输入id
  handleInputIdChange(e) {
    let value = e.target.value;
    this.setState({
      recordId: value,
    });
  }
  // 输入标题
  handleInputTitleChange(e) {
    let value = e.target.value;
    this.setState({
      recordTitle: value,
    });
  }
  // 修改状态
  handleInputStateChange(e) {
    let value = e;
    this.setState({
      recordState: value,
    });
  }
  //修改作者
  handleInputAuthorChange(e) {
    let value = e.target.value;
    this.setState({
      author: value,
    });
  }
  // 搜索 获取表格数据
  handleSearch(startPage) {
    const { recordId, recordTitle, recordState, author } = this.state;
    const params = {
      startPage: startPage,
      pageSize: 10,
      id: recordId,
      title: recordTitle,
      status: recordState,
      author: author,
    };
    this.props.dispatch({
      type: 'taskList/getList',
      payload: params,
    });
    this.setState({
      checkList: [],
      selectedRowKeys: [],
      startPage,
    });
  }

  //确认弹窗
  showConfirm(operation, ids) {
    let that = this;
    confirm({
      title: '确认' + operation + '此数据？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (operation == '发布') {
          that.handlePush(ids);
        } else {
          that.handleRemove(ids);
        }
      },
      onCancel() {},
    });
  }

  // 发布
  handlePush(ids) {
    let params = {};
    let { startPage } = this.state;
    if (ids.length > 0) {
      params = ids;
      this.props.dispatch({
        type: 'taskList/pushTask',
        payload: params,
        pageData: {
          startPage: startPage,
          pageSize: 10,
        },
      });
    } else {
      message.info('请先选择需要上架的档案');
    }
    if (ids.length > 1) {
      this.setState({
        checkList: [],
        selectedRowKeys: [],
      });
    }
  }
  // 下架
  handleRemove(ids) {
    let params = {};
    let { startPage } = this.state;
    if (ids.length > 0) {
      params = ids;
      this.props.dispatch({
        type: 'taskList/removeTask',
        payload: params,
        pageData: {
          startPage: startPage,
          pageSize: 10,
        },
      });
    } else {
      message.info('请先选择需要下架的档案');
    }
    if (ids.length > 1) {
      this.setState({
        checkList: [],
        selectedRowKeys: [],
      });
    }
  }

  render() {
    const { checkList, selectedRowKeys } = this.state;
    const dataList = this.props && this.props.dataList;
    const list = dataList && dataList.list;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let checkList = selectedRows.map(item => item.id);
        console.log(checkList);
        this.setState({
          checkList,
          selectedRowKeys,
        });
      },
    };
    const pagination = {
      total: dataList.total,
      pageSize: dataList.pageSize,
      current: dataList.pageNum,
      showTotal: total => `共${total}项`,
      onChange: this.handleSearch,
    };
    return (
      <Fragment>
        <div className={styles.search_box}>
          <Input
            className={styles.search_input}
            placeholder="档案ID"
            onChange={this.handleInputIdChange}
          />
          <Input
            className={styles.search_input}
            placeholder="标题"
            onChange={this.handleInputTitleChange}
          />
          <Select
            defaultValue="全部状态"
            style={{ width: 160 }}
            allowClear
            onChange={this.handleInputStateChange}
          >
            <Option value="0">未发布</Option>
            <Option value="1">已发布</Option>
            <Option value="2">已下架</Option>
          </Select>
          <Input
            className={styles.search_input}
            placeholder="作者"
            onChange={this.handleInputAuthorChange}
          />
          <Button
            type="primary"
            onClick={() => {
              this.handleSearch(1);
            }}
          >
            搜索
          </Button>
        </div>
        <div className={styles.operation_box}>
          <Link to={`/task/task-edit`}>
            <Button className={styles.operation_btn} type="primary">
              添加档案
            </Button>
          </Link>
          <Button
            className={styles.operation_btn}
            type="primary"
            onClick={() => {
              this.showConfirm('发布', checkList);
            }}
          >
            发布
          </Button>
          <Button
            className={styles.operation_btn}
            type="primary"
            onClick={() => {
              this.showConfirm('下架', checkList);
            }}
          >
            下架
          </Button>
        </div>
        <Table rowSelection={rowSelection} dataSource={list} bordered pagination={pagination}>
          <Column title="档案ID" dataIndex="id" key="id" />
          <Column title="档案标题" dataIndex="title" key="title" />
          <Column
            title="播放"
            key="url"
            width="100"
            render={item => <audio src={item.url} controls="controls" />}
          />
          <Column title="分类" dataIndex="categoryNames" key="categoryNames" />
          <Column title="更新时间" dataIndex="updateTime" key="updateTime" />
          <Column title="发布时间" dataIndex="publishTime" key="publishTime" />
          <Column title="作者" dataIndex="author" key="author" />
          <Column
            title="状态"
            key="status"
            render={item => {
              if (item.status === 0) {
                return <span>未发布</span>;
              } else if (item.status === 1) {
                return <span>已发布</span>;
              } else {
                return <span>已下架</span>;
              }
            }}
          />
          <Column
            title="操作"
            key=""
            render={item => {
              if (item.status === 1) {
                return (
                  <span>
                    <Link to={`/task/task-edit?id=${item.id}`}>编辑</Link>
                    <Divider type="vertical" />
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.showConfirm('下架', [item.id]);
                      }}
                    >
                      下架
                    </a>
                  </span>
                );
              } else {
                return (
                  <span>
                    <Link to={`/task/task-edit?id=${item.id}`}>编辑</Link>
                    <Divider type="vertical" />
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.showConfirm('发布', [item.id]);
                      }}
                    >
                      发布
                    </a>
                  </span>
                );
              }
            }}
          />
        </Table>
      </Fragment>
    );
  }
}

export default TableList;
