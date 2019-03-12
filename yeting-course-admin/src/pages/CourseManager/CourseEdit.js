import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { HOST } from '../../utils/config';
import Link from 'umi/link';

import { Input, Button, Radio, Select, Modal, Form, Upload, Icon, message } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
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

@connect(({ courseList, loading }) => ({
  ...courseList,
  loading: loading.models.courseList,
}))
@Form.create()
class CourseEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSort: false,
      upLoading: false,
      imageUrl: '',
    };
  }

  componentWillMount() {
    const id = this.props.location.query.id;

    if (id) {
      this.props.dispatch({
        type: 'courseList/getCourseDetail',
        payload: id,
      });
    }
  }

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'courseList/CLEAR_ALL',
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
        type: 'courseList/COURSE_DETAIL_CHANGE',
        payload: { coverUrl: info.file.response },
      });
    }
  };

  // 数据提交
  handleSubmit(e) {
    e.preventDefault();

    const {
      form: { validateFields },
      courseDetail,
      dispatch,
    } = this.props;

    const that = this;

    validateFields((err, values) => {
      if (!err) {
        // 校验封面图片是否上传
        if (!courseDetail.coverUrl) {
          message.error('请上传音频封面');

          return false;
        }

        values.coverUrl = courseDetail.coverUrl;
        if (courseDetail.id) {
          values.id = courseDetail.id;
        }
        // 处理价格 * 100
        values.realPrice = values.realPrice * 100;
        values.discountPrice = values.discountPrice * 100;

        // 验证通过
        console.log('校验通过');

        dispatch({
          type: 'courseList/courseAdd',
          payload: values,
          run: courseDetail.id ? 'edit' : 'add',
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { courseDetail, loading } = this.props;

    const layoutCol = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 21,
      },
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.upLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    return (
      <Fragment>
        <PageHeaderWrapper />
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3>{this.props.courseDetail.id ? '编辑课程' : '新增课程'}</h3>
        </div>
        <Form onSubmit={this.handleSubmit.bind(this)} style={{ paddingBottom: 40 }}>
          <FormItem label="课程名称" {...layoutCol}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入课程名称',
                  pattern: /^(?!(\s+$))/,
                },
              ],
              initialValue: courseDetail.name,
            })(<Input maxLength={30} placeholder="输入课程名称" style={{ width: '500px' }} />)}
          </FormItem>
          <FormItem label="课程简介" {...layoutCol}>
            {getFieldDecorator('descr', {
              rules: [
                {
                  required: true,
                  message: '请输入课程简介',
                  pattern: /^(?!(\s+$))/,
                },
              ],
              initialValue: courseDetail.descr,
            })(<TextArea maxLength={500} style={{ width: '500px' }} rows={4} />)}
          </FormItem>
          <FormItem label="课程封面" required={true} {...layoutCol}>
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
                {imageUrl || courseDetail.coverUrl ? (
                  <img
                    style={{ width: 200, height: 150 }}
                    src={imageUrl ? imageUrl : courseDetail.coverUrl}
                    alt="avatar"
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            }
          </FormItem>
          <h3>商品信息</h3>
          <FormItem label="售卖设置" {...layoutCol}>
            {getFieldDecorator('payType', {
              rules: [
                {
                  required: true,
                  message: '请选择售卖设置',
                },
              ],
              initialValue: courseDetail.payType,
            })(
              <RadioGroup>
                <Radio value={'2'}>付费</Radio>
                <Radio value={'1'}>免费</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="商品价格" {...layoutCol}>
            {getFieldDecorator('realPrice', {
              rules: [
                {
                  required: true,
                  message: '请输入商品价格',
                  pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
                },
              ],
              initialValue: courseDetail.realPrice ? courseDetail.realPrice / 100 : '',
            })(<Input style={{ width: '100px' }} />)}
            &nbsp;元
          </FormItem>
          <FormItem label="划线价格" {...layoutCol}>
            {getFieldDecorator('discountPrice', {
              rules: [
                {
                  required: true,
                  message: '请输入划线价格',
                  pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
                },
              ],
              initialValue: courseDetail.discountPrice ? courseDetail.discountPrice / 100 : '',
            })(<Input style={{ width: '100px' }} />)}
            &nbsp;元
          </FormItem>
          <FormItem label="课程天数" {...layoutCol}>
            {getFieldDecorator('courseDays', {
              rules: [
                {
                  required: true,
                  message: '请输入课程天数',
                  pattern: /^\+?[1-9]\d*$/,
                },
              ],
              initialValue: courseDetail.courseDays,
            })(<Input style={{ width: '60px' }} />)}
          </FormItem>
          <FormItem label="打卡天数" {...layoutCol}>
            {getFieldDecorator('checkDays', {
              rules: [
                {
                  required: true,
                  message: '请输入打卡天数',
                  pattern: /^(0|\+?[1-9][0-9]*)$/,
                },
              ],
              initialValue: courseDetail.checkDays,
            })(<Input style={{ width: '60px' }} />)}
          </FormItem>
          <FormItem label="上架设置" {...layoutCol}>
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: '请选择上架设置',
                },
              ],
              initialValue: courseDetail.status != null ? courseDetail.status : 1,
            })(
              <RadioGroup>
                <Radio value={1}>立即上架</Radio>
                <Radio value={0}>暂不上架</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <Link to={`/course/course-list`}>
            <Button style={{ marginLeft: 138 }}>取消</Button>
          </Link>
          <Button loading={loading} style={{ marginLeft: 20 }} type="primary" htmlType="submit">
            保存
          </Button>
        </Form>
      </Fragment>
    );
  }
}
export default CourseEdit;
