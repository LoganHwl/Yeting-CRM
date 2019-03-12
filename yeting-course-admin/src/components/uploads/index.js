import React, { Component, Fragment } from 'react';
import { HOST } from '@/utils/config';
import { Upload, message, Button, Icon } from 'antd';

import styles from './style.less';

class Uploads extends Component {
  constructor(props) {
    super(props);

    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.state = {
      loading: false,
      imageUrl: '',
      audioUrl: '',
    };
  }

  componentWillMount() {}
  componentWillUnmount() {}

  getUploadType = () => {
    const setToken = {
      token: localStorage.getItem('userToken') ? localStorage.getItem('userToken') : '0',
    };
    const { uploadType, imgUrl, fileUrl } = this.props;
    const { imageUrl, audioUrl, loading } = this.state;
    let isShowImg = this.props.isShowImg != undefined ? this.props.isShowImg : true;
    const uploadButtonImg = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const uploadButtonAudio = (
      <Button>
        <Icon type="upload" /> Click to Upload
      </Button>
    );
    if (uploadType === 'img') {
      return (
        <div className={styles.upload_box}>
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={HOST + '/file/upload'}
            beforeUpload={this.beforeUpload}
            onChange={this.handleImgChange}
            headers={setToken}
          >
            {(imgUrl || imageUrl) && isShowImg ? (
              <img className={styles.show_img} src={imgUrl || imageUrl} alt="image" />
            ) : (
              uploadButtonImg
            )}
          </Upload>
        </div>
      );
    } else if (uploadType === 'file') {
      return (
        <div className={styles.upload_box}>
          <Upload
            name="file"
            action={HOST + '/file/upload'}
            accept="audio/*"
            headers={setToken}
            onChange={this.handleFileChange}
          >
            {uploadButtonAudio}
          </Upload>
          {fileUrl || audioUrl ? (
            <audio className={styles.show_audio} src={fileUrl || audioUrl} controls />
          ) : (
            ''
          )}
        </div>
      );
    }
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }
  //上传图片
  handleImgChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
      this.props.getImgUrl(info.file.response);
    }
  };
  //上传文件
  handleFileChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      this.setState({
        audioUrl: info.file.response,
        loading: false,
      });
      this.props.getFileUrl(info.file.response);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    return <Fragment>{this.getUploadType()}</Fragment>;
  }
}

export default Uploads;
