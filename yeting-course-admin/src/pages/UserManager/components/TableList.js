import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, Input, Select, DatePicker } from 'antd';
import styles from '../style.less';
const { RangePicker } = DatePicker;
const { Column } = Table;

@connect(({ userList }) => ({
  ...userList,
}))
class TableList extends Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInputSexChange = this.handleInputSexChange.bind(this);
    this.handleInputSearchChange = this.handleInputSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.showMoreMsg = this.showMoreMsg.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      userSearch: '',
      realName: '',
      mobile: '',
      userSex: '',
      dateRange: [],
      modalVisible: false,
      itemData: {},
      startPage: 1,
    };
  }

  componentWillMount() {
    this.handleSearch(1);
  }
  componentWillUnmount() {}

  handleDateChange(date, dateString) {
    // console.log(date, dateString);
    this.setState({
      dateRange: dateString,
    });
  }

  handleInputSearchChange(e) {
    let value = e.target.value;
    this.setState({
      userSearch: value,
    });
  }

  handleInputRealNameChange(e) {
    let value = e.target.value;
    this.setState({
      realName: value,
    });
  }

  handleInputMobileChange(e) {
    let value = e.target.value;
    this.setState({
      mobile: value,
    });
  }

  handleInputSexChange(e) {
    let value = e;
    this.setState({
      userSex: value,
    });
  }

  handleSearch(startPage) {
    const { userSearch, realName, mobile } = this.state;
    const params = {
      startPage: startPage,
      pageSize: 10,
      keyword: userSearch,
      realName,
      mobile,
    };
    this.props.dispatch({
      type: 'userList/getUserList',
      payload: params,
    });
    this.setState({
      startPage,
    });
  }

  showMoreMsg(item) {
    this.setState({
      modalVisible: true,
      itemData: item,
    });
  }

  handleOk(e) {
    this.setState({
      modalVisible: false,
    });
  }

  handleCancel(e) {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const dataList = this.props && this.props.dataList;
    const list = dataList && dataList.list;
    const { modalVisible, itemData } = this.state;
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
            placeholder="昵称"
            onChange={this.handleInputSearchChange}
          />
          <Input
            className={styles.search_input}
            placeholder="姓名"
            onChange={this.handleInputRealNameChange.bind(this)}
          />
          <Input
            className={styles.search_input}
            placeholder="手机号码"
            onChange={this.handleInputMobileChange.bind(this)}
          />
          <Button
            type="primary"
            className={styles.search_span}
            onClick={() => {
              this.handleSearch(1);
            }}
          >
            搜索
          </Button>
        </div>
        <Table dataSource={list} bordered pagination={pagination}>
          <Column title="用户ID" dataIndex="id" key="id" />
          <Column
            title="头像"
            key="headImgUrl"
            render={item => <img className={styles.table_avatar} src={item.headImgUrl} />}
          />
          <Column title="微信昵称" dataIndex="nickName" key="nickName" />
          <Column title="姓名" dataIndex="realName" key="realName" />
          <Column title="手机号码" dataIndex="mobile" key="mobile" />
          <Column title="用户创建时间" dataIndex="createTime" key="createTime" />
          <Column
            title="操作"
            key=""
            render={item => (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.showMoreMsg(item);
                  }}
                >
                  查看
                </a>
              </span>
            )}
          />
        </Table>
        <Modal
          title="查看"
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <p>
            <span>头像：</span>
            <img src={itemData.headImgUrl} className={styles.detail_avatar} />
          </p>
          <p>
            <span>昵称：</span>
            <span>{itemData.nickName}</span>
          </p>
          <p>
            <span>用户ID：</span>
            <span>{itemData.id}</span>
          </p>
          <p>
            <span>姓名：</span>
            <span>{itemData.realName}</span>
          </p>
          <p>
            <span>手机号码：</span>
            <span>{itemData.mobile}</span>
          </p>
          <p>
            <span>性别：</span>
            <span>{itemData.sex == 1 ? '男' : itemData.sex == 2 ? '女' : '未知'}</span>
          </p>
          <p>
            <span>城市：</span>
            <span>{itemData.city}</span>
          </p>
          <p>
            <span>openID：</span>
            <span>{itemData.openId}</span>
          </p>
          <p>
            <span>union_id：</span>
            <span>{itemData.unionId}</span>
          </p>
          <p>
            <span>小鹅通user_id：</span>
            <span>{itemData.xiaoeId}</span>
          </p>
        </Modal>
      </Fragment>
    );
  }
}

export default TableList;
