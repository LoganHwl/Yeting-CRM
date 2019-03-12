import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import Noty from '../../components/Noty';

import { Input, Button, Table, Select, Divider, Modal, Form } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

// import styles from './style.less';

@connect(({ courseList, loading }) => ({
  ...courseList,
  loading: loading.models.courseList,
}))
@Form.create()
class CourseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSort: false,
      sortId: 0,
    };
  }

  componentWillMount() {
    this.onSearch();
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'courseList/CLEAR_ALL',
    });
  }

  onSearch(page = 1) {
    const { search, pageSize } = this.props;

    this.props.dispatch({
      type: 'courseList/CHANGE_PAGENO',
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
      type: 'courseList/getCourseList',
      payload: params,
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'courseList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  // 删除课程弹框
  courseDelete(record) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content: '删除后已购用户将无法使用，确认删除吗？',
      okText: '删除',
      cancelText: '取消',
      async onOk() {
        await dispatch({
          type: 'courseList/courseDelete',
          payload: record.id,
        });

        self.onSearch();
      },
      onCancel() {},
    });
  }

  // 上、下架课程弹框
  courseStop(record) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content:
        record.status == 0
          ? '是否上架？'
          : '下架后已购买的用户仍可以查看，未购买的用户将无法购买，确认下架吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        await dispatch({
          type: record.status == 0 ? 'courseList/courseOnline' : 'courseList/courseOffline',
          payload: [record.id],
        });

        self.onSearch();
      },
      onCancel() {},
    });
  }

  // 显示排序弹框
  showSort(id) {
    this.setState({ isSort: true, sortId: id });
  }

  // 关闭排序弹框
  closeSort() {
    this.setState({ isSort: false });
  }

  // 排序数据提交
  handleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    const that = this;

    validateFields(async (err, values) => {
      if (!err) {
        // 验证通过
        values.id = that.state.sortId;

        await dispatch({
          type: 'courseList/courseRank',
          payload: values,
        });

        that.onSearch();
        that.closeSort();
      }
    });
  }

  render() {
    const { loading, pageSize, startPage, courseList, search } = this.props;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'ID',
        width: 60,
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '课程名称',
        key: 'name',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={record.coverUrl} style={{ width: 80, height: 80 }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 80,
                  paddingLeft: 10,
                }}
              >
                <span>{record.name}</span>
                <span style={{ color: 'red' }}>{`￥${record.realPrice / 100}`}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: '更新期数',
        width: 90,
        dataIndex: 'itemCount',
        key: 'itemCount',
      },
      {
        title: '销量',
        width: 70,
        dataIndex: 'buyCount',
        key: 'buyCount',
      },
      {
        title: '状态',
        width: 80,
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
        title: '课程天数',
        width: 90,
        dataIndex: 'courseDays',
        key: 'courseDays',
      },
      {
        title: '打卡天数',
        width: 90,
        dataIndex: 'checkDays',
        key: 'checkDays',
      },
      {
        title: '操作',
        width: 285,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <Link to={`/course/course-list/content?id=${record.id}&name=${record.name}`}>
                内容管理{' '}
              </Link>
              {/*(record.status == -1 || record.status == 1) && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() => this.manuscriptStatus(record)}>提审 </a>
                </span>
              )*/}
              <Divider type="vertical" />
              <a onClick={this.showSort.bind(this, record.id)}>排序 </a>
              <Divider type="vertical" />
              <a onClick={this.courseStop.bind(this, record)}>
                {record.status == 0 ? '上架' : '下架'}{' '}
              </a>
              <Divider type="vertical" />
              <Link to={`/course/course-list/edit?id=${record.id}`}>编辑</Link>
              <Divider type="vertical" />
              <a onClick={this.courseDelete.bind(this, record)}>删除 </a>
            </div>
          );
        },
      },
    ];

    const pagination = {
      total: courseList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    return (
      <Fragment>
        <PageHeaderWrapper />
        <div style={{ backgroundColor: 'white', paddingTop: 10 }}>
          <Link to={`/course/course-list/edit`}>
            <Button type="primary">新建课程</Button>
          </Link>
          <br />
          <br />
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
            value={search.name}
            placeholder="输入课程名称"
            style={{ width: 220, marginBottom: 10, marginRight: 16 }}
            onChange={e => this.onSearchConditionChange({ name: e.target.value })}
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
          dataSource={courseList.list}
          pagination={pagination}
          bordered
        />
        {/** 排序弹框 */}
        {this.state.isSort && (
          <Modal
            title="排序"
            visible={true}
            width={380}
            style={{ top: 220 }}
            footer={null}
            onCancel={() => this.closeSort()}
          >
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem label="排列至第" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('num', {
                  rules: [
                    {
                      required: true,
                      message: '请输入位置',
                    },
                  ],
                  initialValue: '',
                })(<Input style={{ width: '50px' }} />)}
                <span>&nbsp;&nbsp;位</span>
                <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit">
                  确定
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={this.closeSort.bind(this)}>
                  取消
                </Button>
              </FormItem>
            </Form>
          </Modal>
        )}
        <Noty />
      </Fragment>
    );
  }
}
export default CourseList;
