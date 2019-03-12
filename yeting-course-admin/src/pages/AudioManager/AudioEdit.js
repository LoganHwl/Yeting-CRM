import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';

import { Input, Button, Select, Modal, Radio, Form, Upload, Icon, message } from 'antd';

import SimditorTextarea from './SimditorTextarea';
import { HOST } from '../../utils/config';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// import styles from './style.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('请上传图片文件 jpg/png');
  }
  const isLt4M = file.size / 1024 / 1024 < 4;
  if (!isLt4M) {
    message.error('Image must smaller than 4MB!');
  }
  return isJPG && isLt4M;
}

@connect(({ audioList, loading }) => ({
  ...audioList,
  loading: loading.models.audioList,
}))
@Form.create()
class AudioEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      upLoading: false,
      imageUrl: '',
    };
  }

  componentWillMount() {
    const id = this.props.location.query.id;

    if (id) {
      this.props.dispatch({
        type: 'audioList/getAudioDetail',
        payload: id,
      });
    }
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'audioList/CLEAR_ALL',
    });
  }

  // 上传图片
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ upLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          upLoading: false,
        })
      );

      this.props.dispatch({
        type: 'audioList/AUDIO_DETAIL_CHANGE',
        payload: { coverUrl: info.file.response },
      });
    }
  };

  // 数据提交
  handleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      audioDetail,
      dispatch,
    } = this.props;

    const that = this;

    validateFields((err, values) => {
      if (!err) {
        // 校验音频是否上传
        if (!audioDetail.contentUrl) {
          message.error('请上传音频');

          return false;
        }
        // 校验封面图片是否上传
        if (!audioDetail.coverUrl) {
          message.error('请上传音频封面');

          return false;
        }

        values.contentUrl = audioDetail.contentUrl;
        values.coverUrl = audioDetail.coverUrl;
        if (audioDetail.id) {
          values.id = audioDetail.id;
        }

        // 验证通过
        console.log('校验通过');
        console.log('提交的参数', values);

        dispatch({
          type: 'audioList/audioAdd',
          payload: values,
          run: audioDetail.id ? 'edit' : 'add',
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { audioDetail, dispatch, loading } = this.props;

    const layoutCol = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 21,
      },
    };

    // 封面图片上传
    const uploadButton = (
      <div>
        <Icon type={this.state.upLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    // 音频文件上传
    const fileProps = {
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
          message.success(`${file.name} 文件上传成功`);

          dispatch({
            type: 'audioList/AUDIO_DETAIL_CHANGE',
            payload: { contentUrl: file.response },
          });

          console.log('上传的文件地址', file.response);
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
      },
      headers: {
        token: localStorage.getItem('userToken') ? localStorage.getItem('userToken') : '0',
      },
      showUploadList: false,
    };

    return (
      <Fragment>
        <PageHeaderWrapper />

        <h3 style={{ marginTop: 20, marginBottom: 20 }}>音频编辑</h3>
        {!loading && (
          <Form onSubmit={this.handleSubmit.bind(this)} style={{ paddingBottom: 40 }}>
            <FormItem label="音频名称" {...layoutCol}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入音频名称',
                  },
                ],
                initialValue: audioDetail.title,
              })(<Input maxLength={45} placeholder="输入音频名称" style={{ width: '500px' }} />)}
            </FormItem>
            <FormItem label="导师" {...layoutCol}>
              {getFieldDecorator('author', {
                rules: [
                  {
                    required: true,
                    message: '请输入导师',
                  },
                ],
                initialValue: audioDetail.author,
              })(<Input maxLength={45} placeholder="输入导师" style={{ width: '500px' }} />)}
            </FormItem>
            <FormItem label="音频上传" required={true} {...layoutCol}>
              {
                <Upload {...fileProps}>
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              }
              {audioDetail.contentUrl && (
                <div>
                  已上传文件：
                  {audioDetail.contentUrl}
                </div>
              )}
            </FormItem>
            <FormItem label="音频封面" required={true} {...layoutCol}>
              {
                <Upload
                  name="file"
                  listType="picture-card"
                  // className={styles.avatar_uploader}
                  showUploadList={false}
                  action={HOST + '/file/upload'}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                  headers={{
                    token: localStorage.getItem('userToken')
                      ? localStorage.getItem('userToken')
                      : '0',
                  }}
                >
                  {imageUrl || audioDetail.coverUrl ? (
                    <img
                      style={{ width: 200, height: 150 }}
                      src={imageUrl ? imageUrl : audioDetail.coverUrl}
                      alt="avatar"
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              }
            </FormItem>
            <FormItem label="音频详情" {...layoutCol}>
              {getFieldDecorator('descr', {
                rules: [
                  {
                    required: true,
                    message: '请输入音频详情',
                  },
                ],
                initialValue: audioDetail.descr ? audioDetail.descr : '',
              })(<SimditorTextarea id="description" placeholder="请输入内容" />)}
            </FormItem>
            <FormItem label="上架设置" {...layoutCol}>
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择上架设置',
                  },
                ],
                initialValue: audioDetail.status != null ? audioDetail.status : 1,
              })(
                <RadioGroup>
                  <Radio value={1}>立即上架</Radio>
                  <Radio value={0}>暂不上架</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <Link to={`/audio/audio-list`}>
              <Button style={{ marginLeft: 138 }}>取消</Button>
            </Link>
            <Button loading={loading} style={{ marginLeft: 20 }} type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        )}
      </Fragment>
    );
  }
}
export default AudioEdit;
