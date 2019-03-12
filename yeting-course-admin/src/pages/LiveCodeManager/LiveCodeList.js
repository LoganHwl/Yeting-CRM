import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Noty from '../../components/Noty';
import { HOST } from '../../utils/config';
import moment from 'moment';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { upload } from '@/services/api';

import {
  DatePicker,
  Input,
  Button,
  Table,
  Select,
  Divider,
  Modal,
  Form,
  Upload,
  Icon,
  message,
  Dropdown,
  Menu,
} from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// import styles from './style.less';

@connect(({ liveCodeList, loading }) => ({
  ...liveCodeList,
  loading: loading.models.liveCodeList,
}))
@Form.create()
class LiveCodeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddCode: false,
      isSort: false,
      codes: [],
      sortIndex: 0,
      codeRecord: {}, // 编辑时的item数据
      deleteIds: [], // 删除的id集合
      isCropper: false,
      srcCropper: '', // 需要裁剪的图片路径
      isUpdateImg: false, // 更新图片时的标记
      updateImgIndex: 0, // 更新图片位置的标记
    };
  }

  componentWillMount() {
    this.onSearch();

    // 获取选择的课程关联列表
    this.props.dispatch({
      type: 'liveCodeList/getCodeCourseList',
      payload: {},
    });
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'liveCodeList/CLEAR_ALL',
    });
  }

  onSearch(page = 1) {
    const { search, pageSize } = this.props;

    this.props.dispatch({
      type: 'liveCodeList/CHANGE_PAGENO',
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
      type: 'liveCodeList/getLiveCodeList',
      payload: params,
    });
  }

  onSearchConditionChange(searchPair) {
    this.props.dispatch({
      type: 'liveCodeList/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }

  // 删除活码弹框
  liveCodeDelete(id) {
    const { dispatch } = this.props;
    const self = this;

    Modal.confirm({
      title: '提示',
      content: '删除后，该时期内的用户只能扫描默认码，确认删除吗？',
      okText: '永久删除',
      cancelText: '取消',
      async onOk() {
        await dispatch({
          type: 'liveCodeList/codeDelete',
          payload: { liveId: id },
        });

        self.onSearch();
      },
      onCancel() {},
    });
  }

  // 显示裁剪图片弹框
  showCropper() {
    this.setState({ isCropper: true });
  }

  closeCropper() {
    this.setState({ isCropper: false, isUpdateImg: false });
  }

  // 保存裁剪后的图片
  saveCropper() {
    const self = this;
    // console.log('裁剪后的图片地址', this.refs.cropper.getCroppedCanvas().toDataURL())
    var file = this.dataURLtoFile(this.refs.cropper.getCroppedCanvas().toDataURL(), 'img.png');

    var params = new FormData();
    params.append('file', file);

    upload(params).then(data => {
      console.log(data);

      if (self.state.isUpdateImg) {
        const newCodes = this.state.codes;
        newCodes[self.state.updateImgIndex].url = data;
        this.setState({ codes: newCodes });
      } else {
        const newCodes = self.state.codes;
        newCodes.push({ remain: 100, url: data, used: 0 });

        self.setState({ codes: newCodes });
      }
      message.success(`二维码上传成功`);

      console.log('上传的文件地址', data);

      self.closeCropper();
    });
  }

  // base64 转换为文件
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  // 调用 var file = dataURLtoFile(base64Data, imgName);

  showAddCode(record) {
    this.setState({ isAddCode: true });

    if (record) {
      this.setState({ codeRecord: record, codes: record.codeList });
    }
  }

  closeAddCode() {
    this.setState({ isAddCode: false, codes: [], codeRecord: {}, deleteIds: [] });
    this.onSearch();
  }

  // 显示排序弹框
  showSort(index) {
    this.setState({ isSort: true, sortIndex: index });
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
    } = this.props;

    const that = this;

    validateFields((err, values) => {
      if (!err) {
        // 验证通过
        const newCodes = that.state.codes;
        const sortItem = newCodes[that.state.sortIndex];

        newCodes.splice(that.state.sortIndex, 1);
        newCodes.splice(values.sortNum - 1, 0, sortItem);

        that.setState({ codes: newCodes });

        that.closeSort();

        console.log('排序');
      }
    });
  }

  // 添加/编辑 章数据提交
  addHandleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      dispatch,
    } = this.props;

    const that = this;

    validateFields(async (err, values) => {
      if (!err) {
        // 验证通过
        if (that.state.codes.length == 0) {
          message.error('请添加二维码');

          return false;
        }
        // 验证剩余次数是否为0和正整数
        if (that.state.codes.some(item => !new RegExp(/^(0|\+?[1-9][0-9]*)$/).test(item.remain))) {
          message.error('剩余次数必须为0或正整数');

          return false;
        }

        if (that.state.codeRecord.id) {
          values.id = that.state.codeRecord.id;
          values.deleteIds = that.state.deleteIds;
        }
        values.startTime = moment(values.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss');
        values.endTime = moment(values.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss');
        values.codes = that.state.codes;

        await dispatch({
          type: 'liveCodeList/codeAdd',
          payload: values,
          run: that.state.codeRecord.id ? 'edit' : 'add',
        });

        that.closeAddCode();
        that.onSearch();

        console.log('添加/编辑');
      }
    });
  }

  render() {
    const { loading, pageSize, startPage, liveCodeList, search, codeCourseList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { codeRecord, codes } = this.state;
    const self = this;

    const columns = [
      {
        title: '活码标题',
        key: 'title',
        dataIndex: 'title',
      },
      {
        title: '活码数',
        width: 90,
        dataIndex: 'codeCount',
        key: 'codeCount',
      },
      {
        title: '总次数',
        width: 80,
        dataIndex: 'totalCount',
        key: 'totalCount',
      },
      {
        title: '总剩余次数',
        width: 105,
        dataIndex: 'remainCount',
        key: 'remainCount',
      },
      {
        title: '展示次数',
        width: 90,
        dataIndex: 'userCount',
        key: 'userCount',
      },
      {
        title: '创建时间',
        width: 120,
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '展示期',
        width: 120,
        key: 'startTime',
        render: (text, record) => `${record.startTime} ~ ${record.endTime}`,
      },
      {
        title: '关联课程',
        width: 180,
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '操作',
        width: 110,
        key: 'update',
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.showAddCode.bind(this, record)}>编辑 </a>
              <Divider type="vertical" />
              <a onClick={this.liveCodeDelete.bind(this, record.id)}>删除 </a>
            </div>
          );
        },
      },
    ];

    const pagination = {
      total: liveCodeList.total,
      pageSize,
      current: startPage,
      showTotal: total => `共${total}项`,
      onChange: this.onSearch.bind(this),
    };

    // 二维码上传
    const fileProps = {
      accept: 'image/*',
      action: HOST + '/file/upload',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
        if (file.status === 'uploading') {
          // this.setState({ loading: true });
          return;
        }
        if (file.status === 'done') {
          message.success(`${file.name} 二维码上传成功`);
          const newCodes = self.state.codes;
          newCodes.push({ remain: 100, url: file.response, used: 0 });

          self.setState({ codes: newCodes });

          console.log('上传的文件地址', file.response);
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
      },
      headers: {
        token: localStorage.getItem('userToken') ? localStorage.getItem('userToken') : '0',
      },
      showUploadList: false,
      beforeUpload: file => {
        //阻止自动上传
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
          message.error('请上传图片文件 jpg/png');
          return false;
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
          message.error('Image must smaller than 4MB!');
          return false;
        }

        var reader = new FileReader();
        reader.readAsDataURL(file); //开始读取文件
        // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
        reader.onload = e => {
          this.setState({
            srcCropper: e.target.result, //cropper的图片路径
            isCropper: true, //打开控制裁剪弹窗的变量，为true即弹窗
          });
        };
        return false;
      },
    };

    return (
      <Fragment>
        <PageHeaderWrapper />

        <Button
          type="primary"
          style={{ marginTop: 20, marginBottom: 20 }}
          onClick={this.showAddCode.bind(this, '')}
        >
          创建活码
        </Button>

        <Table
          rowKey={'id'}
          locale={{ emptyText: '没有数据' }}
          columns={columns}
          loading={loading}
          dataSource={liveCodeList.list}
          pagination={pagination}
          bordered
        />

        {/** 添加/编辑活码窗口 */}
        {this.state.isAddCode && (
          <Modal
            title="活码编辑"
            visible={true}
            width={800}
            style={{ top: 50 }}
            footer={null}
            onCancel={() => this.closeAddCode()}
          >
            <Form onSubmit={this.addHandleSubmit.bind(this)}>
              <FormItem label="关联课程" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('courseId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择关联课程',
                    },
                  ],
                  initialValue: codeRecord.courseId,
                })(
                  <Select style={{ width: 150 }}>
                    {codeCourseList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>;
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="活码名称" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入活码名称',
                    },
                  ],
                  initialValue: codeRecord.title,
                })(<Input style={{ width: '300px' }} />)}
              </FormItem>
              <FormItem label="开课时间" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('rangeTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开课时间',
                    },
                  ],
                  initialValue: codeRecord.startTime
                    ? [moment(codeRecord.startTime), moment(codeRecord.endTime)]
                    : '',
                })(
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: 350 }}
                  />
                )}
              </FormItem>
              <FormItem
                label="配置活码"
                required={true}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
              >
                {
                  <Upload {...fileProps}>
                    <Button>
                      <Icon type="upload" /> 上传二维码
                    </Button>
                  </Upload>
                }
                {codes.map((item, index) => {
                  return (
                    <div
                      style={{
                        border: '1px solid #DEDEDE',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 5,
                        marginTop: 5,
                      }}
                    >
                      {/*
                        <img src={item.url} alt={'二维码'} style={{ width: 80, height: 80 }} />
                        */}
                      <Upload
                        name="file"
                        listType="picture-card"
                        // className={styles.avatar_uploader}
                        showUploadList={false}
                        action={HOST + '/file/upload'}
                        beforeUpload={file => {
                          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                          if (!isJPG) {
                            message.error('请上传图片文件 jpg/png');
                            return false;
                          }
                          const isLt4M = file.size / 1024 / 1024 < 4;
                          if (!isLt4M) {
                            message.error('Image must smaller than 4MB!');
                            return false;
                          }

                          var reader = new FileReader();
                          reader.readAsDataURL(file); //开始读取文件
                          // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
                          reader.onload = e => {
                            this.setState({
                              srcCropper: e.target.result, //cropper的图片路径
                              isCropper: true, //打开控制裁剪弹窗的变量，为true即弹窗
                              isUpdateImg: true,
                              updateImgIndex: index,
                            });
                          };
                          return false;
                        }}
                        onChange={info => {
                          if (info.file.status === 'uploading') {
                            return;
                          }
                          if (info.file.status === 'done') {
                            const newCodes = this.state.codes;
                            newCodes[index].url = info.file.response;
                            this.setState({ codes: newCodes });
                          }
                        }}
                        headers={{
                          token: localStorage.getItem('userToken')
                            ? localStorage.getItem('userToken')
                            : '0',
                        }}
                      >
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item>
                                <img style={{ width: 250 }} src={item.url} alt="avatar" />
                              </Menu.Item>
                            </Menu>
                          }
                        >
                          <img style={{ width: 80, height: 80 }} src={item.url} alt="avatar" />
                        </Dropdown>
                      </Upload>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                        }}
                      >
                        <div>
                          已扫描次数：
                          {item.used}次
                        </div>
                        <div>
                          <span>剩余次数</span>
                          <Input
                            value={item.remain}
                            style={{ width: '55px', marginLeft: 5 }}
                            onChange={
                              //e => this.onSearchConditionChange({ name: e.target.value })
                              e => {
                                const newCodes = this.state.codes;
                                newCodes[index].remain = e.target.value;
                                this.setState({ codes: newCodes });
                              }
                            }
                          />
                        </div>
                      </div>
                      <div style={{ marginLeft: 150 }}>
                        <Button
                          onClick={() => {
                            // 保存删除的集合
                            const newDeleteIds = self.state.deleteIds;
                            newDeleteIds.push(item.id);
                            self.setState({ deleteIds: newDeleteIds });

                            const newCodes = self.state.codes;
                            newCodes.splice(index, 1);
                            self.setState({ codes: newCodes });
                          }}
                        >
                          删除
                        </Button>
                        <Button
                          onClick={this.showSort.bind(this, index)}
                          style={{ marginLeft: 10 }}
                          type="primary"
                        >
                          排序
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </FormItem>

              <Button style={{ marginLeft: 138 }} onClick={this.closeAddCode.bind(this)}>
                取消
              </Button>
              <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit">
                保存
              </Button>
            </Form>
          </Modal>
        )}

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
                {getFieldDecorator('sortNum', {
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

        {/** 弹窗裁剪图片 */}
        {this.state.isCropper && (
          <Modal
            key="cropper_img_modal_key"
            visible={true}
            loading={this.props.loading}
            footer={[
              <Button
                type="primary"
                onClick={this.saveCropper.bind(this)}
                loading={this.props.loading}
              >
                保存
              </Button>,
              <Button onClick={() => this.closeCropper()} loading={this.props.loading}>
                取消
              </Button>,
            ]}
            onCancel={() => this.closeCropper()}
          >
            {/* Cropper图片裁剪器 */}
            <Cropper
              src={this.state.srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
              ref="cropper"
              style={{ height: 400 }}
              preview=".cropper-preview"
              className="company-logo-cropper"
              viewMode={1} // 定义cropper的视图模式
              zoomable={true} // 是否允许放大图像
              aspectRatio={533 / 675} // image的纵横比
              guides={true} // 显示在裁剪框上方的虚线
              background={false} // 是否显示背景的马赛克
              rotatable={false} // 是否旋转
            />
          </Modal>
        )}

        <Noty />
      </Fragment>
    );
  }
}
export default LiveCodeList;
