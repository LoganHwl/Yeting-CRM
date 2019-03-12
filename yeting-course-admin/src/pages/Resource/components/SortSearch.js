import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Button, Select } from 'antd';

import styles from '../style.less';

@connect(({ sortManager }) => ({
  ...sortManager,
}))
class AlbumSearch extends Component {
  constructor(props) {
    super(props);
    this.handleInputIdChange = this.handleInputIdChange.bind(this);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleInputStatusChange = this.handleInputStatusChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      id: '',
      name: '',
      status: '',
    };
  }

  componentWillMount() {}
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

  handleSearch() {
    const { id, name, status } = this.state;
    const params = {
      startPage: 1,
      pageSize: 10,
      id: id,
      name: name,
      status: status,
    };
    this.props.dispatch({
      type: 'sortManager/getSortList',
      payload: params,
    });
  }

  render() {
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
          <Button type="primary" className={styles.search_span} onClick={this.handleSearch}>
            搜索
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default AlbumSearch;
