import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Button, Select } from 'antd';

import styles from '../style.less';

const Option = Select.Option;

@connect(({ albumManager }) => ({
  ...albumManager,
}))
class AlbumSearch extends Component {
  constructor(props) {
    super(props);
    this.handleInputIdChange = this.handleInputIdChange.bind(this);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputTypeChange = this.handleInputTypeChange.bind(this);
    this.handleInputStateChange = this.handleInputStateChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      albumId: '',
      albumName: '',
      albumState: '',
      albumType: '',
    };
  }

  componentWillMount() {
    const params = {};
    this.props.dispatch({
      type: 'albumManager/getCategoryList',
      payload: params,
    });
  }

  componentWillUnmount() {}
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
  handleSearch() {
    const { albumId, albumName, albumState, albumType } = this.state;
    const params = {
      startPage: 1,
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
  }

  render() {
    const categoryList = this.props.categoryList && this.props.categoryList;
    const categoryOptions =
      categoryList &&
      categoryList.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ));
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
          <Button type="primary" className={styles.search_span} onClick={this.handleSearch}>
            搜索
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default AlbumSearch;
