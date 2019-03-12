import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import Uploads from '@/components/Uploads';
import { Table, Divider, Button, Modal, Input, Checkbox, Radio, message, Select } from 'antd';
import styles from '../style.less';
const confirm = Modal.confirm;
const Option = Select.Option;
const { Column } = Table;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

@connect(({ albumManager }) => ({
  ...albumManager,
}))
class AlbumList extends Component {
  constructor(props) {
    super(props);

    this.handleInputIdChange = this.handleInputIdChange.bind(this);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputTypeChange = this.handleInputTypeChange.bind(this);
    this.handleInputStateChange = this.handleInputStateChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.showConfirm = this.showConfirm.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleEditOk = this.handleEditOk.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleEditAlbumName = this.handleEditAlbumName.bind(this);
    this.handleCateChange = this.handleCateChange.bind(this);
    this.handleDesChange = this.handleDesChange.bind(this);
    this.handleCloseAlbum = this.handleCloseAlbum.bind(this);
    this.handleOpenAlbum = this.handleOpenAlbum.bind(this);
    this.handleHoriChange = this.handleHoriChange.bind(this);
    this.handleVerticalChange = this.handleVerticalChange.bind(this);
    this.state = {
      albumId: '',
      albumName: '',
      albumState: '',
      albumType: '',
      selectedRowKeys: [],
      checkList: [],
      editAlbumVisible: false,
      itemData: {},
      isShowImg: true, //图片上传框是否显示图片缩略图
      startPage: 1,
    };
  }

  componentWillMount() {
    this.handleSearch(1);

    this.props.dispatch({
      type: 'albumManager/getCategoryList',
      payload: {},
    });
  }

  //专辑ID
  handleInputIdChange(e) {
    let value = e.target.value;
    this.setState({
      albumId: value,
    });
  }
  //专辑名
  handleInputNameChange(e) {
    let value = e.target.value;
    this.setState({
      albumName: value,
    });
  }
  //改变状态
  handleInputStateChange(e) {
    let value = e;
    this.setState({
      albumState: value,
    });
  }
  //改变类型
  handleInputTypeChange(e) {
    let value = e;
    this.setState({
      albumType: value,
    });
  }
  //搜索
  handleSearch(startPage) {
    const { albumId, albumName, albumState, albumType } = this.state;
    const params = {
      startPage: startPage,
      pageSize: 10,
      id: albumId,
      name: albumName,
      status: albumState,
      categoryId: albumType,
    };
    this.props.dispatch({
      type: 'albumManager/getAlbumList',
      payload: params,
    });
    this.setState({
      selectedRowKeys: [],
      checkList: [],
      startPage,
    });
  }

  async handleShowModal(item, type) {
    console.log('item', item);
    let id = item.id;
    const detail = await this.props.dispatch({
      type: 'albumManager/getAlbumDetail',
      payload: id,
    });
    let itemData = detail;
    itemData.types = type;
    this.setState({
      itemData: itemData,
      editAlbumVisible: true,
      isShowImg: true,
    });
  }

  handleEditOk() {
    let { itemData } = this.state;
    if (
      itemData.name &&
      itemData.thumbUrl &&
      itemData.categoryIds &&
      itemData.categoryIds.length > 0 &&
      itemData.descr &&
      (itemData.vertical == 1 || itemData.vertical == 0) &&
      (itemData.horizontal == 0 || itemData.horizontal == 1)
    ) {
      const params = itemData;
      if (itemData.types === 'new') {
        this.props.dispatch({
          type: 'albumManager/addAlbum',
          payload: params,
        });
      } else {
        this.props.dispatch({
          type: 'albumManager/updateAlbum',
          payload: params,
        });
      }
      this.setState({
        editAlbumVisible: false,
        itemData: {},
        isShowImg: false,
      });
    } else {
      message.info('信息填写不完整！');
    }
  }
  handleEditCancel() {
    this.setState({
      editAlbumVisible: false,
      itemData: {},
      isShowImg: false,
    });
  }
  //修改名称
  handleEditAlbumName(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.name = value;
    this.setState({
      itemData: itemData,
    });
  }
  //修改分类
  handleCateChange(checkedValues) {
    console.log('checked = ', checkedValues);
    let { itemData } = this.state;
    itemData.categoryIds = checkedValues;
    this.setState({
      itemData: itemData,
    });
  }
  //修改描述
  handleDesChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.descr = value;
    this.setState({
      itemData: itemData,
    });
  }
  //获取图片上传的url
  getImgUrl(e) {
    let { itemData } = this.state;
    itemData.thumbUrl = e;
    this.setState({
      itemData: itemData,
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
          that.handleCloseAlbum(ids);
        } else {
          that.handleOpenAlbum(ids);
        }
      },
      onCancel() {},
    });
  }

  //关闭专辑
  handleCloseAlbum(items) {
    const params = items;
    let { startPage } = this.state;
    this.props.dispatch({
      type: 'albumManager/closeAlbum',
      payload: params,
      pageData: {
        startPage: startPage,
        pageSize: 10,
      },
    });
    if (items.length > 1) {
      this.setState({
        selectedRowKeys: [],
        checkList: [],
      });
    }
  }
  //开启专辑
  handleOpenAlbum(items) {
    const params = items;
    let { startPage } = this.state;
    this.props.dispatch({
      type: 'albumManager/openAlbum',
      payload: params,
      pageData: {
        startPage: startPage,
        pageSize: 10,
      },
    });
  }
  //选择横屏
  handleHoriChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.horizontal = value;
    this.setState({
      itemData: itemData,
    });
  }
  //选择竖屏
  handleVerticalChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.vertical = value;
    this.setState({
      itemData: itemData,
    });
  }

  render() {
    const categoryList = this.props && this.props.categoryList;
    const categoryOptions =
      categoryList &&
      categoryList.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ));

    const { editAlbumVisible, itemData, isShowImg, checkList, selectedRowKeys } = this.state;
    const dataList = this.props && this.props.dataList;
    console.log('dataList', dataList);
    const list = dataList && dataList.list;
    const checkCategoryOptions =
      categoryList &&
      categoryList.map(item => {
        return { label: item.name, value: item.id };
      });
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
      total: dataList && dataList.total,
      pageSize: dataList && dataList.pageSize,
      current: dataList && dataList.pageNum,
      showTotal: total => `共${total}项`,
      onChange: this.handleSearch,
    };
    return (
      <Fragment>
        <div className={styles.search_box}>
          <Input
            className={styles.search_input}
            placeholder="专辑ID"
            onChange={this.handleInputIdChange}
          />
          <Input
            className={styles.search_input}
            placeholder="专辑名"
            onChange={this.handleInputNameChange}
          />
          <Select
            defaultValue="全部状态"
            style={{ width: 160 }}
            allowClear
            onChange={this.handleInputStateChange}
          >
            <Option value="0">关闭</Option>
            <Option value="1">开启</Option>
          </Select>
          <Select
            defaultValue="全部类型"
            style={{ width: 160 }}
            className={styles.search_select}
            allowClear
            onChange={this.handleInputTypeChange}
          >
            {categoryOptions}
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
          <Button
            className={styles.operation_btn}
            type="primary"
            onClick={() => {
              this.handleShowModal({}, 'new');
            }}
          >
            添加专辑
          </Button>
          <Button
            className={styles.operation_btn}
            type="primary"
            onClick={() => {
              this.showConfirm('关闭', checkList);
            }}
          >
            关闭
          </Button>
        </div>
        <Table rowSelection={rowSelection} dataSource={list} bordered pagination={pagination}>
          <Column title="专辑ID" dataIndex="id" key="id" />
          <Column
            title="专辑图"
            key="thumbUrl"
            render={item => (
              <img className={styles.table_avatar} src={item.thumbUrl} alt="avatar" />
            )}
          />
          <Column title="专辑名" dataIndex="name" key="name" />
          <Column title="分类" dataIndex="categoryNames" key="categoryNames" />
          <Column title="创建时间" dataIndex="createTime" key="createTime" />
          <Column title="资源数" dataIndex="ducomentNums" key="ducomentNums" />
          <Column
            title="状态"
            key="status"
            render={item => {
              if (item.status == 0) {
                return <span>关闭</span>;
              } else {
                return <span>开启</span>;
              }
            }}
          />
          <Column
            title="操作"
            key="action"
            render={item => {
              if (item.id != 1 && item.id != 2 && item.id != 3) {
                if (item.status == 0) {
                  return (
                    <span>
                      <Link to={`/resource/album-detail?id=${item.id}`}>查看</Link>
                      <Divider type="vertical" />
                      <Link to={`/resource/album-edit?id=${item.id}`}>编辑列表</Link>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.handleShowModal(item, 'edit');
                        }}
                      >
                        编辑属性
                      </a>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.showConfirm('开启', [item.id]);
                        }}
                      >
                        开启
                      </a>
                    </span>
                  );
                } else {
                  return (
                    <span>
                      <Link to={`/resource/album-detail?id=${item.id}`}>查看</Link>
                      <Divider type="vertical" />
                      <Link to={`/resource/album-edit?id=${item.id}`}>编辑列表</Link>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.handleShowModal(item, 'edit');
                        }}
                      >
                        编辑属性
                      </a>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.showConfirm('关闭', [item.id]);
                        }}
                      >
                        关闭
                      </a>
                    </span>
                  );
                }
              } else {
                if (item.status == 0) {
                  return (
                    <span>
                      <Link to={`/resource/album-detail?id=${item.id}`}>查看</Link>
                      {/* <Divider type="vertical" />
                        <Link to={`/resource/album-edit?id=${item.id}`}>编辑列表</Link> */}
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.handleShowModal(item, 'edit');
                        }}
                      >
                        编辑属性
                      </a>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.showConfirm('开启', [item.id]);
                        }}
                      >
                        开启
                      </a>
                    </span>
                  );
                } else {
                  return (
                    <span>
                      <Link to={`/resource/album-detail?id=${item.id}`}>查看</Link>
                      {/* <Divider type="vertical" />
                        <Link to={`/resource/album-edit?id=${item.id}`}>编辑列表</Link> */}
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.handleShowModal(item, 'edit');
                        }}
                      >
                        编辑属性
                      </a>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.showConfirm('关闭', [item.id]);
                        }}
                      >
                        关闭
                      </a>
                    </span>
                  );
                }
              }
            }}
          />
        </Table>
        <Modal
          title={itemData.types === 'new' ? '增加专辑' : '编辑属性'}
          visible={editAlbumVisible}
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
          okText="确定"
          cancelText="取消"
        >
          <div>
            <span>名称：</span>
            <Input
              className={styles.search_input}
              value={itemData.name}
              onChange={this.handleEditAlbumName}
            />
          </div>
          <div className={styles.modal_box}>
            <span>封面图：</span>
            <Uploads
              uploadType="img"
              isShowImg={isShowImg}
              imgUrl={itemData.thumbUrl}
              className={styles.modal_upload}
              getImgUrl={this.getImgUrl.bind(this)}
            />
          </div>
          <div className={styles.modal_box}>
            <span className={styles.modal_name}>分类：</span>
            <CheckboxGroup
              options={checkCategoryOptions}
              onChange={this.handleCateChange}
              value={itemData.categoryIds}
            />
          </div>
          <div className={styles.modal_box}>
            <span>横屏：</span>
            <RadioGroup onChange={this.handleHoriChange} value={itemData.horizontal}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          </div>
          <div className={styles.modal_box}>
            <span>竖屏：</span>
            <RadioGroup onChange={this.handleVerticalChange} value={itemData.vertical}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          </div>
          <div className={styles.modal_box}>
            <span>描述：</span>
            <Input
              type="textarea"
              value={itemData.descr}
              rows={4}
              onChange={this.handleDesChange}
              className={styles.input_textarea}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default AlbumList;
