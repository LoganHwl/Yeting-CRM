import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Noty from '../../components/Noty';
import { stringify } from 'qs';
import { DatePicker, Input, Button, Table, Select, Modal, Divider, Form, message } from 'antd';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
import { HOST } from '@/utils/config';
// import styles from './style.less';

@connect(({ orderList, loading }) => ({
  ...orderList,
  loading: loading.models.orderList,
}))
@Form.create()
class OrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefund: false,
      isReturn: false,
      isDetail: false,
      orderRecord: {},
      selectType: '',
      selectTypeValue: '',
      timeRange: [],
    };
  }

  componentWillMount() {
    this.onSearch();
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'orderList/CLEAR_ALL',
    });
  }

  onSearch(page = 1) {
    const { search, pageSize } = this.props;

    this.props.dispatch({
      type: 'orderList/CHANGE_PAGENO',
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

    if (this.state.selectType && !this.state.selectTypeValue) {
      message.error('请输入搜索关键字');
      return false;
    }
    if (!this.state.selectType && this.state.selectTypeValue) {
      message.error('请选择搜索类型');
      return false;
    }

    if (this.state.selectType == '1') {
      params.orderno = this.state.selectTypeValue;
    } else if (this.state.selectType == '2') {
      params.courseName = this.state.selectTypeValue;
    } else if (this.state.selectType == '3') {
      params.nickname = this.state.selectTypeValue;
    } else if (this.state.selectType == '4') {
      params.userId = this.state.selectTypeValue;
    } else if (this.state.selectType == '5') {
      params.source = this.state.selectTypeValue;
    } else if (this.state.selectType == '6') {
      params.page = this.state.selectTypeValue;
    }

    if (this.state.timeRange[0]) {
      params.startTime = this.state.timeRange[0];
      params.endtTime = this.state.timeRange[1];
    }

    this.props.dispatch({
      type: 'orderList/getOrderList',
      payload: params,
    });

    this.props.dispatch({
      type: 'orderList/getOrderStatistics',
      payload: params,
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'orderList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  showRefund(record) {
    this.setState({ isRefund: true, orderRecord: record });
  }

  showReturn(record) {
    this.setState({ isReturn: true, orderRecord: record });
  }

  closeRefund() {
    this.setState({ isRefund: false, isReturn: false });
  }

  // 退款或者返现的数据提交
  handleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    const that = this;

    validateFields(async (err, values) => {
      if (!err) {
        if (values.operateMoney * 100 > that.state.orderRecord.price) {
          message.error('退款/返现金额不能大于订单金额');

          return false;
        }
        // 验证通过
        values.id = that.state.orderRecord.id;
        values.type = that.state.isRefund ? 2 : 3;
        values.operateMoney = values.operateMoney * 100;

        await dispatch({
          type: 'orderList/orderRefund',
          payload: values,
        });

        that.onSearch();
        that.closeRefund();
      }
    });
  }

  showDetail(detail) {
    this.setState({ isDetail: true, orderRecord: detail });
  }

  closeDetail() {
    this.setState({ isDetail: false });
  }
  // 导出
  exportDown(){
    
    const { search, pageSize } = this.props;
    const params = {};

    for (const [key, value] of Object.entries(search)) {
      if (value) {
        params[key] = value;
      }
    }

    if (this.state.selectType && !this.state.selectTypeValue) {
      message.error('请输入搜索关键字');
      return false;
    }
    if (!this.state.selectType && this.state.selectTypeValue) {
      message.error('请选择搜索类型');
      return false;
    }

    if (this.state.selectType == '1') {
      params.orderno = this.state.selectTypeValue;
    } else if (this.state.selectType == '2') {
      params.courseName = this.state.selectTypeValue;
    } else if (this.state.selectType == '3') {
      params.nickname = this.state.selectTypeValue;
    } else if (this.state.selectType == '4') {
      params.userId = this.state.selectTypeValue;
    } else if (this.state.selectType == '5') {
      params.source = this.state.selectTypeValue;
    } else if (this.state.selectType == '6') {
      params.page = this.state.selectTypeValue;
    }

    if (this.state.timeRange[0]) {
      params.startTime = this.state.timeRange[0];
      params.endtTime = this.state.timeRange[1];
    }

    window.open(`${HOST}/order/export?${stringify(params)}`)
  } 
  render() {
    const { loading, pageSize, startPage, orderList, search, orderStatistics } = this.props;
    const { orderRecord } = this.state;

    const columns = [
      {
        title: '订单号',
        width: 120,
        key: 'orderno',
        dataIndex: 'orderno',
      },
      {
        title: '课程名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '下单时间',
        width: 110,
        dataIndex: 'ordertime',
        key: 'ordertime',
      },
      {
        title: '订单状态',
        width: 100,
        key: 'status',
        render: (text, record) => {
          let statusName = '';
          switch (record.status) {
            case 0:
              statusName = '未付款';
              break;
            case 1:
              statusName = '付款成功';
              break;
            case 2:
              statusName = '退款';
              break;
            case 3:
              statusName = '返现';
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
        title: '实付金额',
        width: 100,
        key: 'rprice',
        render: (text, record) => record.price / 100,
      },
      {
        title: '买家昵称',
        width: 100,
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '渠道码',
        width: 120,
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: '页面',
        width: 120,
        dataIndex: 'page',
        key: 'page',
      },
      {
        title: '操作',
        width: 190,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.showDetail.bind(this, record)}>订单详情 </a>
              {record.status != 2 &&
                record.status != 3 && (
                  <span>
                    <Divider type="vertical" />
                    <a onClick={this.showRefund.bind(this, record)}>退款 </a>
                  </span>
                )}
              {record.status != 2 &&
                record.status != 3 && (
                  <span>
                    <Divider type="vertical" />
                    <a onClick={this.showReturn.bind(this, record)}>返现 </a>
                  </span>
                )}
            </div>
          );
        },
      },
    ];

    const detailColumns = [
      {
        title: '课程名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '课程类型',
        width: 120,
        key: 'type',
        render: (text, record) => {
          let statusName = '';
          switch (record.type) {
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
              statusName = '音频';
              break;
          }

          return statusName;
        },
      },
      {
        title: '实付金额',
        width: 120,
        key: 'realPrice',
        render: (text, record) => orderRecord.price / 100,
      },
    ];

    const pagination = {
      total: orderList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    const modalOptions = {
      title: this.state.isRefund ? '退款操作' : '返现操作',
      visible: true,
      width: 600,
      style: { top: 50 },
      footer: null,
      onCancel: () => this.closeRefund(),
    };
    const detailModalOptions = {
      title: '订单详情',
      visible: true,
      width: 1000,
      style: { top: 50 },
      footer: null,
      onCancel: () => this.closeDetail(),
    };
    const layoutCol = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <PageHeaderWrapper />
        <div className="handle" style={{ backgroundColor: 'white', paddingTop: 10 }}>
          <Button
            style={{ marginBottom: 10, marginRight: 16 }}
            type="primary"
            onClick={() => this.exportDown()}
          >
            导出
          </Button>
        </div>        
        <div style={{ backgroundColor: 'white', paddingTop: 10 }}>
          <Select
            placeholder="选择搜索类型"
            allowClear={true}
            style={{ width: 130, marginBottom: 10, marginRight: 16 }}
            onChange={value => this.setState({ selectType: value })}
          >
            <Option value={'1'}>订单号</Option>
            <Option value={'2'}>课程名称</Option>
            <Option value={'3'}>买家昵称</Option>
            <Option value={'4'}>用户ID</Option>
            <Option value={'5'}>渠道码</Option>
            <Option value={'6'}>页面</Option>
          </Select>
          <Input
            placeholder="关键字"
            style={{ width: 220, marginBottom: 10, marginRight: 16 }}
            onChange={e => this.setState({ selectTypeValue: e.target.value })}
          />
          <span>下单时间：</span>
          <RangePicker
            // defaultValue= {[,]}
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: 350, marginBottom: 10, marginRight: 16 }}
            onChange={(data, dataString) => this.setState({ timeRange: dataString })}
          />
          <span>订单状态：</span>
          <Select
            value={search.status}
            placeholder="选择状态"
            allowClear={true}
            style={{ width: 100, marginBottom: 10, marginRight: 16 }}
            onChange={value => this.onSearchConditionChange({ status: value })}
          >
            <Option value={'0'}>未付款</Option>
            <Option value={'1'}>付款成功</Option>
            <Option value={'2'}>退款</Option>
            <Option value={'3'}>返现</Option>
          </Select>
          <Button
            style={{ marginBottom: 10, marginRight: 16 }}
            type="primary"
            onClick={() => this.onSearch()}
          >
            搜索
          </Button>
        </div>
        <div style={{ marginTop: 10, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>
          时间段内，总计流水
          <span style={{ color: 'blue' }}>￥{orderStatistics.total / 100}</span>
          ，其中平台收益
          <span style={{ color: 'blue' }}>￥{orderStatistics.profit / 100}</span>
          ，返现
          <span style={{ color: 'blue' }}>￥{orderStatistics.cashBack / 100}</span>
          ，退款
          <span style={{ color: 'blue' }}>￥{orderStatistics.fefund / 100}</span>
          。销量
          <span style={{ color: 'blue' }}>{orderStatistics.totalCount}件</span>
          ，其中含返现
          <span style={{ color: 'blue' }}>{orderStatistics.backCount}</span>
          件，退款
          <span style={{ color: 'blue' }}>{orderStatistics.refundCount}</span>件
        </div>
        <Table
          rowKey={'id'}
          locale={{ emptyText: '没有数据' }}
          columns={columns}
          loading={loading}
          dataSource={orderList.list}
          pagination={pagination}
          bordered
        />
        {/** 退款和返现弹窗 */}
        {(this.state.isRefund || this.state.isReturn) && (
          <Modal {...modalOptions}>
            <div>
              订单总金额：￥
              {orderRecord.price / 100}
            </div>
            <br />
            <div>
              用户已上课天数：
              {orderRecord.courseDays}天
            </div>
            <br />
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem
                label={this.state.isRefund ? '退款给用户金额' : '返现给用户金额'}
                {...layoutCol}
              >
                {getFieldDecorator('operateMoney', {
                  rules: [
                    {
                      required: true,
                      message: '请输入金额',
                      pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
                    },
                  ],
                  initialValue: '',
                })(
                  <Input
                    placeholder={`最大可退/返款金额￥${orderRecord.price / 100}`}
                    style={{ width: '300px' }}
                  />
                )}
              </FormItem>
              <FormItem label="原因" {...layoutCol}>
                {getFieldDecorator('reason', {
                  rules: [
                    {
                      required: true,
                      message: '请输入原因',
                    },
                  ],
                  initialValue: '',
                })(<TextArea style={{ width: '300px' }} rows={4} />)}
              </FormItem>
              <Button style={{ marginLeft: 138 }} onClick={this.closeRefund.bind(this)}>
                取消
              </Button>
              <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit">
                确定
              </Button>
            </Form>
          </Modal>
        )}
        {/** 订单详情弹窗 */}
        {this.state.isDetail && (
          <Modal {...detailModalOptions}>
            <div>
              <h3>订单信息</h3>
              <span>
                订单号：
                {orderRecord.orderno}
              </span>
              <br />
              <span>
                订单状态：
                {orderRecord.status == 0
                  ? '未付款'
                  : orderRecord.status == 1
                    ? '付款成功'
                    : orderRecord.status == 2
                      ? '退款'
                      : '返现'}
              </span>
              <br />
              <span>
                退款/返现金额：
                {orderRecord.operateMoney ? orderRecord.operateMoney / 100 : ''}
              </span>
              <br />
              <span>
                下单时间：
                {orderRecord.ordertime}
              </span>
              <br />
              <span>
                支付时间：
                {orderRecord.paytime}
              </span>
              <br />
            </div>
            <br />
            <div>
              <h3>微信支付信息</h3>
              <span>
                交易单号：
                {orderRecord.weixinno}
              </span>
              <br />
            </div>
            <br />
            <div>
              <h3>买家信息</h3>
              <span>
                买家昵称：
                {orderRecord.nickname}
              </span>
              <br />
              <span>
                姓名：
                {orderRecord.userWechat.realName}
              </span>
              <br />
              <span>
                联系电话：
                {orderRecord.userWechat.mobile}
              </span>
              <br />
            </div>
            <br />
            <Table
              rowKey={'id'}
              locale={{ emptyText: '没有数据' }}
              columns={detailColumns}
              dataSource={[orderRecord.courseInfo]}
              pagination={false}
              bordered
            />
            <br />
          </Modal>
        )}
        <Noty />
      </Fragment>
    );
  }
}
export default OrderList;
