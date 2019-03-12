import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import Noty from '../../components/Noty';

import { Input, Button, Table, Select, Modal, Divider, Form, message } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

// import styles from './style.less';

@connect(({ courseList, loading }) => ({
  ...courseList,
  loading: loading.models.courseList,
}))
@Form.create()
class CourseContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSort: false,
      isAddSection: false,
      isAddCourseware: false,
      courseId: 0,
      courseName: '',
      sortRecord: 0,
      sortType: 0,
      chapterRecord: {},
      searchRefName: '', // 章节添加课程的搜索名称
      selectedRows: [], // 添加时所选的课件
    };
  }

  componentWillMount() {
    const id = this.props.location.query.id;
    const name = this.props.location.query.name;

    this.setState({ courseId: id, courseName: name });
  }

  componentDidMount() {
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

    params.courseId = this.state.courseId;

    this.props.dispatch({
      type: 'courseList/getChapterList',
      payload: params,
    });
  }

  onSearchRef() {
    this.props.dispatch({
      type: 'courseList/getChapterRefList',
      payload: { courseId: this.state.courseId, name: this.state.searchRefName },
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'courseList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  // 子表格
  expandedRowRender(record) {
    console.log('子表格数据', record.itemList);
    const columns = [
      {
        title: '课件名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '类型',
        width: 120,
        key: 'type',
        render: (text, record) => {
          let statusName = '';
          switch (record.status) {
            case 0:
              statusName = '音频';
              break;
            case 1:
              statusName = '音频';
              break;
            case 2:
              statusName = '音频';
              break;
            case -1:
              statusName = '音频';
              break;
            default:
              break;
          }

          return statusName;
        },
      },
      {
        title: '播放数',
        key: 'playCount',
        width: 120,
        dataIndex: 'playCount',
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
        title: '操作',
        width: 160,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.showSort.bind(this, record, 2)}>排序 </a>
              <Divider type="vertical" />
              <Link to={`/audio/audio-list/edit?id=${record.id}`}>编辑</Link>
              <Divider type="vertical" />
              <a onClick={this.removeModal.bind(this, record, 2)}>移除 </a>
            </div>
          );
        },
      },
    ];

    return <Table columns={columns} dataSource={record.itemList} pagination={false} />;
  }

  // 移除的弹框 type: 1为章节 2为章节里的课件
  removeModal(record, type) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content: '移除后已购用户将无法使用，确认移除吗？',
      okText: '移除',
      cancelText: '取消',
      async onOk() {
        if (type == 1) {
          await dispatch({
            type: 'courseList/chapterDelete',
            payload: record.id,
          });
        } else {
          await dispatch({
            type: 'courseList/chapterRefDelete',
            payload: { chapterId: record.chapterId, itemId: record.id },
          });
        }

        self.onSearch();
      },
      onCancel() {},
    });
  }

  // 显示排序弹框 type: 1为章节 2为章节里的课件
  showSort(record, type) {
    this.setState({ isSort: true, sortRecord: record, sortType: type });
  }

  // 关闭排序弹框
  closeSort() {
    this.setState({ isSort: false });
  }

  // 排序数据提交
  sortHandleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    const that = this;

    validateFields(async (err, values) => {
      if (!err) {
        // 验证通过
        if (that.state.sortType == 1) {
          values.id = that.state.sortRecord.id;
          values.courseId = that.state.courseId;

          await dispatch({
            type: 'courseList/chapterRank',
            payload: values,
          });
        } else {
          values.itemId = that.state.sortRecord.id;
          values.chapterId = that.state.sortRecord.chapterId;

          await dispatch({
            type: 'courseList/chapterRefRank',
            payload: values,
          });
        }

        that.onSearch();
        that.closeSort();
      }
    });
  }

  // 显示 添加/编辑 章弹框
  showAddSection(record) {
    this.setState({ isAddSection: true });

    if (record) {
      this.setState({ chapterRecord: record });
    }
  }

  // 关闭 添加/编辑 章弹框
  closeAddSection() {
    this.setState({ isAddSection: false, chapterRecord: {} });
  }

  // 添加/编辑 章数据提交
  sectionHandleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    const that = this;

    validateFields(async (err, values) => {
      if (!err) {
        // 验证通过
        values.courseId = that.state.courseId;
        if (that.state.chapterRecord.id) {
          values.id = that.state.chapterRecord.id;
        }

        await dispatch({
          type: 'courseList/chapterAdd',
          payload: values,
          run: that.state.chapterRecord.id ? 'edit' : 'add',
        });

        that.onSearch();
        that.closeAddSection();
      }
    });
  }

  // 显示添加课件弹框
  async showAddCourseware(record) {
    await this.props.dispatch({
      type: 'courseList/getChapterRefList',
      payload: { courseId: this.state.courseId },
    });

    this.setState({ isAddCourseware: true, chapterRecord: record });
  }

  // 关闭添加课件弹框
  closeAddCourseware() {
    this.setState({
      isAddCourseware: false,
      searchRefName: '',
      selectedRows: [],
      chapterRecord: {},
    });
  }

  // 添加课件的列表复选框
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows });
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  // 保存添加的课件
  async addChapterRef() {
    if (this.state.selectedRows.length == 0) {
      message.error('请选择课件');
      return false;
    }

    const itemId = this.state.selectedRows.map(item => item.id);

    await this.props.dispatch({
      type: 'courseList/addChapterRef',
      payload: { chapterId: this.state.chapterRecord.id, itemId },
    });

    this.closeAddCourseware();
    this.onSearch();
  }

  render() {
    const { loading, pageSize, startPage, chapterList, search, chapterRefList } = this.props;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '章名',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '操作',
        width: 210,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.showAddCourseware.bind(this, record)}>添加 </a>
              <Divider type="vertical" />
              <a onClick={this.showSort.bind(this, record, 1)}>排序 </a>
              <Divider type="vertical" />
              <a onClick={this.showAddSection.bind(this, record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={this.removeModal.bind(this, record, 1)}>移除 </a>
            </div>
          );
        },
      },
    ];

    const pagination = {
      total: chapterList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    // 添加课件的列表
    const coursewareColumns = [
      {
        title: '课件名称',
        key: 'title',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={record.coverUrl} style={{ width: 50, height: 40 }} />
              <span style={{ marginLeft: 10 }}>{record.title}</span>
            </div>
          );
        },
      },
    ];

    return (
      <Fragment>
        <PageHeaderWrapper />
        <h3 style={{ marginTop: 20 }}>
          课程名称：
          {this.state.courseName}
        </h3>
        <Button type="primary" style={{ marginTop: 20 }} onClick={this.showAddSection.bind(this)}>
          添加章
        </Button>
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
            value={search.name}
            placeholder="输入课程件"
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
          dataSource={chapterList.list}
          pagination={pagination}
          expandedRowRender={this.expandedRowRender.bind(this)}
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
            <Form onSubmit={this.sortHandleSubmit.bind(this)}>
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

        {/** 添加/编辑 章弹框 */}
        {this.state.isAddSection && (
          <Modal
            title="添加/编辑章"
            visible={true}
            width={420}
            style={{ top: 220 }}
            footer={null}
            onCancel={() => this.closeAddSection()}
          >
            <Form onSubmit={this.sectionHandleSubmit.bind(this)}>
              <FormItem label="章名" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入章名',
                      pattern: /^(?!(\s+$))/,
                    },
                  ],
                  initialValue: this.state.chapterRecord.title,
                })(<Input maxLength={30} style={{ width: '300px' }} />)}
              </FormItem>

              <Button style={{ marginLeft: 110 }} onClick={this.closeAddSection.bind(this)}>
                取消
              </Button>
              <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit">
                保存
              </Button>
            </Form>
          </Modal>
        )}

        {/** 添加课程弹框 */}
        {this.state.isAddCourseware && (
          <Modal
            title="添加课件"
            visible={true}
            width={600}
            style={{ top: 50 }}
            footer={null}
            onCancel={() => this.closeAddCourseware()}
          >
            <div>
              <Input
                value={this.state.searchRefName}
                placeholder="输入课件名称"
                style={{ width: 220, marginBottom: 10, marginRight: 16 }}
                onChange={e => this.setState({ searchRefName: e.target.value })}
              />
              <Button
                style={{ marginBottom: 10, marginRight: 160 }}
                onClick={() => this.onSearchRef()}
              >
                搜索
              </Button>
              <Link to={`/audio/audio-list/edit`}>
                <Button type="primary">新建课件</Button>
              </Link>
            </div>
            <div style={{ height: 500, overflowY: 'scroll' }}>
              <Table
                style={{ marginBottom: 25 }}
                rowSelection={this.rowSelection}
                columns={coursewareColumns}
                dataSource={chapterRefList}
                loading={loading}
                pagination={false}
              />
            </div>

            <Button style={{ marginLeft: 200 }} onClick={this.closeAddCourseware.bind(this)}>
              取消
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.addChapterRef.bind(this)}
            >
              确定
            </Button>
          </Modal>
        )}
        <Noty />
      </Fragment>
    );
  }
}
export default CourseContent;
