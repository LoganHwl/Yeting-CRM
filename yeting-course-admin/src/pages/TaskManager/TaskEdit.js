import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Input, Button, Checkbox, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Uploads from '@/components/Uploads';
import styles from './style.less';
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;

@connect(({ taskList }) => ({
  ...taskList,
}))
class TaskList extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleOut = this.handleOut.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleCateChange = this.handleCateChange.bind(this);
    this.getFileUrl = this.getFileUrl.bind(this);
    this.getImgUrl = this.getImgUrl.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.handleDesChange = this.handleDesChange.bind(this);
    this.state = {
      id: '',
      itemData: {
        author: '夜听FM',
      },
    };
  }

  componentWillMount() {
    const params = {};
    this.props.dispatch({
      type: 'taskList/getCategoryList',
      payload: params,
    });
  }

  async componentDidMount() {
    let id = this.props.location.query.id;
    if (id) {
      const detailData = await this.props.dispatch({
        type: 'taskList/getDetailData',
        payload: id,
      });
      this.setState({
        id,
        itemData: detailData,
      });
    }
  }

  async handleSave() {
    let { itemData, id } = this.state;
    itemData.type = 3;
    itemData.author = itemData.author ? itemData.author : '夜听FM';
    const params = itemData;
    if (!params.title || !params.url || !params.duration) {
      message.info('信息填写不完整！');
      return;
    }
    if (id) {
      let save = await this.props.dispatch({
        type: 'taskList/updateList',
        payload: params,
      });
      if (save) {
        router.push('/task/task-list');
      }
    } else {
      let save = await this.props.dispatch({
        type: 'taskList/addList',
        payload: params,
      });
      if (!save) {
        router.push('/task/task-list');
      }
    }
  }

  //确认弹窗
  showConfirm() {
    let that = this;
    confirm({
      title: '确认下架此数据？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.handleOut();
      },
      onCancel() {},
    });
  }

  async handleOut() {
    let { itemData } = this.state;
    const params = [itemData.id];
    const out = await this.props.dispatch({
      type: 'taskList/removeTask',
      payload: params,
    });
    if (out == 1) {
      router.push('/task/task-list');
    }
  }

  getCategoryList = () => {};
  //修改档案标题
  handleTitleChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.title = value;
    this.setState({
      itemData: itemData,
    });
  }
  //修改作者
  handleAuthorChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.author = value;
    this.setState({
      itemData: itemData,
    });
  }
  //修改分类
  handleCateChange(checkedValues) {
    let { itemData } = this.state;
    itemData.categoryIds = checkedValues;
    this.setState({
      itemData: itemData,
    });
  }
  //修改音频时长
  handleTimeChange(e) {
    let value = e.target.value;
    let { itemData } = this.state;
    itemData.duration = value;
    this.setState({
      itemData: itemData,
    });
  }
  //获取上传的文件地址
  getFileUrl(e) {
    let { itemData } = this.state;
    itemData.url = e;
    this.setState({
      itemData: itemData,
    });
  }
  //获取上传的图片地址
  getImgUrl(e) {
    let { itemData } = this.state;
    itemData.thumbUrl = e;
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
  //判断是否显示下架按钮
  checkOutBtn() {
    const { itemData } = this.state;
    if (itemData.status == 1) {
      return (
        <Button className={styles.edit_btn} onClick={this.showConfirm}>
          下架
        </Button>
      );
    }
  }

  render() {
    const { itemData } = this.state;
    const categoryList = this.props.categoryList && this.props.categoryList;
    const categoryOptions =
      categoryList &&
      categoryList.map(item => {
        return { label: item.name, value: item.id };
      });
    return (
      <Fragment>
        <PageHeaderWrapper />
        <div className={styles.edit_box}>
          <span className={styles.input_label}>档案标题：</span>
          <Input
            className={styles.edit_input}
            value={itemData.title}
            placeholder="档案标题"
            maxLength="20"
            onChange={this.handleTitleChange}
          />
          <br />
          {/* <span className={styles.input_span}>原文链接：</span>
          <Input className={styles.edit_input} value={itemData} placeholder="原文链接" />
          <br /> */}
          <span className={styles.input_span}>作者：</span>
          <Input
            className={styles.edit_input}
            defaultValue="夜听FM"
            value={itemData.author}
            onChange={this.handleAuthorChange}
          />
          <div className={styles.checkbox_item}>
            <span className={styles.input_span}>分类：</span>
            <CheckboxGroup
              options={categoryOptions}
              value={itemData.categoryIds}
              onChange={this.handleCateChange}
            />
          </div>
          <div className={styles.album_edit_box}>
            <span className={styles.input_label}>文件上传：</span>
            <Uploads
              uploadType="file"
              fileUrl={itemData.url}
              getFileUrl={this.getFileUrl.bind(this)}
            />
          </div>
          <div className={styles.album_edit_box}>
            <span className={styles.input_label}>音频时长：</span>
            <Input
              className={styles.edit_input}
              value={itemData.duration}
              onChange={this.handleTimeChange}
            />
          </div>
          <div className={styles.album_edit_box}>
            <span className={styles.input_span}>主图：</span>
            <Uploads
              uploadType="img"
              imgUrl={itemData.thumbUrl}
              getImgUrl={this.getImgUrl.bind(this)}
            />
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
          <div className={styles.btn_box}>
            <Button className={styles.edit_btn} type="primary" onClick={this.handleSave}>
              保存
            </Button>
            {this.checkOutBtn()}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default TaskList;
