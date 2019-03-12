import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button, Modal, Input, Select } from 'antd';
import styles from '../style.less';
const confirm = Modal.confirm;
const { Column } = Table;

@connect(({ sortManager }) => ({
  ...sortManager,
}))
class AlbumList extends Component {
  constructor(props) {
    super(props);

    this.handleInputIdChange = this.handleInputIdChange.bind(this);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputStatusChange = this.handleInputStatusChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.showConfirm = this.showConfirm.bind(this);
    this.handleAddSort = this.handleAddSort.bind(this);
    this.handleAddOk = this.handleAddOk.bind(this);
    this.handleAddCancel = this.handleAddCancel.bind(this);
    this.handleShowAddModal = this.handleShowAddModal.bind(this);
    this.handleShowEditModal = this.handleShowEditModal.bind(this);
    this.handleEditOk = this.handleEditOk.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleCloseSort = this.handleCloseSort.bind(this);
    this.handleOpenSort = this.handleOpenSort.bind(this);

    this.state = {
      id: '',
      name: '',
      status: '',
      addSotrVisible: false,
      editSotrVisible: false,
      addSortName: '',
      itemData: {},
      startPage: 1,
    };
  }

  componentWillMount() {
    this.handleSearch(1);
  }
  componentWillUnmount() {}

  handleInputIdChange(e) {
    let value = e.target.value;
    this.setState({
      id: value,
    });
  }

  handleInputNameChange(e) {
    let value = e.target.value;
    this.setState({
      name: value,
    });
  }

  handleInputStatusChange(e) {
    let value = e;
    this.setState({
      status: value,
    });
  }

  handleSearch(startPage) {
    const { id, name, status } = this.state;
    const params = {
      startPage: startPage,
      pageSize: 10,
      id: id,
      name: name,
      status: status,
    };
    this.props.dispatch({
      type: 'sortManager/getSortList',
      payload: params,
    });
    this.setState({
      startPage,
    });
  }

  handleAddSort(e) {
    let value = e.target.value;
    this.setState({
      addSortName: value,
    });
  }

  handleAddOk(e) {
    let name = this.state.addSortName;
    if (name) {
      const params = {
        name: name,
      };
      this.props.dispatch({
        type: 'sortManager/addSort',
        payload: params,
      });
      this.setState({
        addSotrVisible: false,
        addSortName: '',
      });
    } else {
      message.info('请先输入需要新增的分类名称');
    }
  }
  handleAddCancel() {
    this.setState({
      addSotrVisible: false,
      addSortName: '',
    });
  }
  handleShowAddModal() {
    this.setState({
      addSotrVisible: true,
    });
  }
  handleShowEditModal(item) {
    this.setState({
      editSotrVisible: true,
      itemData: item,
    });
  }
  handleEditOk() {
    let { addSortName, itemData } = this.state;
    if (addSortName) {
      const params = {
        id: itemData.id,
        name: addSortName,
      };
      this.props.dispatch({
        type: 'sortManager/updateSort',
        payload: params,
      });
      this.setState({
        editSotrVisible: false,
        addSortName: '',
      });
    } else {
      message.info('请先输入需要修改为的分类名称');
    }
  }
  handleEditCancel() {
    this.setState({
      editSotrVisible: false,
      addSortName: '',
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
        if (operation == '关闭') {
          that.handleCloseSort(ids);
        } else {
          that.handleOpenSort(ids);
        }
      },
      onCancel() {},
    });
  }

  handleCloseSort(item) {
    const params = [item.id];
    let { startPage } = this.state;
    this.props.dispatch({
      type: 'sortManager/closeSort',
      payload: params,
      pageData: {
        startPage: startPage,
        pageSize: 10,
      },
    });
  }
  handleOpenSort(item) {
    const params = [item.id];
    let { startPage } = this.state;
    this.props.dispatch({
      type: 'sortManager/openSort',
      payload: params,
      pageData: {
        startPage: startPage,
        pageSize: 10,
      },
    });
  }
  render() {
    const dataList = this.props && this.props.dataList;
    const list = dataList && dataList.list;
    const { addSotrVisible, editSotrVisible, itemData, addSortName } = this.state;
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
            placeholder="分类ID"
            onChange={this.handleInputIdChange}
          />
          <Input
            className={styles.search_input}
            placeholder="分类名"
            onChange={this.handleInputNameChange}
          />
          <Select
            defaultValue="全部状态"
            style={{ width: 160 }}
            allowClear
            onChange={this.handleInputStatusChange}
          >
            <Option value="0">关闭</Option>
            <Option value="1">开启</Option>
          </Select>
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
        <div className={styles.operation_box}>
          <Button className={styles.operation_btn} type="primary" onClick={this.handleShowAddModal}>
            添加分类
          </Button>
        </div>
        <Table dataSource={list} bordered pagination={pagination}>
          <Column title="分类ID" dataIndex="id" key="id" />
          <Column title="分类名" dataIndex="name" key="name" />
          <Column title="创建时间" dataIndex="createTime" key="createTime" />
          <Column title="sid" dataIndex="sid" key="sid" />
          <Column
            title="状态"
            key="status"
            render={item => {
              if (item.status == 1) {
                return <span>开启</span>;
              } else {
                return <span>关闭</span>;
              }
            }}
          />
          <Column
            title="操作"
            key=""
            render={item => {
              if (item.status == 1) {
                return (
                  <span>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.handleShowEditModal(item);
                      }}
                    >
                      编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.showConfirm('关闭', item);
                      }}
                    >
                      关闭
                    </a>
                  </span>
                );
              } else {
                return (
                  <span>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.handleShowEditModal(item);
                      }}
                    >
                      编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.showConfirm('开启', item);
                      }}
                    >
                      开启
                    </a>
                  </span>
                );
              }
            }}
          />
        </Table>
        <Modal
          title="添加分类"
          visible={addSotrVisible}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}
          okText="确定"
          cancelText="取消"
        >
          <p>
            <span>分类名称：</span>
            <Input
              className={styles.search_input}
              value={addSortName}
              onChange={this.handleAddSort}
            />
          </p>
        </Modal>
        <Modal
          title="编辑"
          visible={editSotrVisible}
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
          okText="确定"
          cancelText="取消"
        >
          <p>
            <span>原名称：</span>
            <span> {itemData.name} </span>
          </p>
          <p>
            <span>新名称：</span>
            <Input
              className={styles.search_input}
              value={addSortName}
              onChange={this.handleAddSort}
            />
          </p>
        </Modal>
      </Fragment>
    );
  }
}

export default AlbumList;
