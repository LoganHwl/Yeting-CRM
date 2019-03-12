import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Button, Select, DatePicker, Table, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './style.less';

const { RangePicker } = DatePicker;
const { Column } = Table;
const Option = Select.Option;

@connect(({ albumManager, loading }) => ({
  ...albumManager,
  isLoading: loading.models.albumManager,
}))
class AlbumEdit extends Component {
  constructor(props) {
    super(props);

    this.handleSearchAdd = this.handleSearchAdd.bind(this);
    this.handleRemoveOut = this.handleRemoveOut.bind(this);
    this.handleToTop = this.handleToTop.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInputCateChange = this.handleInputCateChange.bind(this);
    this.handleSearchList = this.handleSearchList.bind(this);
    this.getDocList = this.getDocList.bind(this);
    this.state = {
      albumId: null,
      checkListSearch: [], //选中的搜索资源
      checkListDoc: [], //选中的栏目资源
      searchItem: {}, //搜索条件
      searchSelectRowKeys: [], //选中的搜索资源行
      docSelectRowKeys: [], //选中的栏目资源行
      searchStartPage: 1, //搜索资源的startPage
      docStartPage: 1, //栏目资源的startPage
    };
  }

  componentWillMount() {
    const params = {};
    this.props.dispatch({
      type: 'albumManager/getCategoryList',
      payload: params,
    });
  }
  componentDidMount() {
    let albumId = this.props.location.query.id;
    if (albumId) {
      this.setState({
        albumId: albumId,
      });
      this.getDocList(1, 10, albumId);
    }
  }
  //获取栏目内资源列表
  getDocList(startPage, pageSize, id) {
    const albumId = id || this.state.albumId;
    const params = {
      startPage: startPage,
      pageSize: pageSize,
      albumId: albumId,
    };
    this.props.dispatch({
      type: 'albumManager/getAlbumDocList',
      payload: params,
    });
    this.setState({
      checkListDoc: [],
      docSelectRowKeys: [],
      docStartPage: startPage,
    });
  }
  //添加
  handleSearchAdd(ids) {
    const { albumId, searchStartPage } = this.state;
    const params = {
      albumId: albumId,
      documentIds: ids,
    };
    this.props.dispatch({
      type: 'albumManager/addAlbumDocList',
      payload: params,
      albumList: {
        startPage: searchStartPage,
        pageSize: 10,
        albumId: albumId,
      },
    });
    this.setState({
      checkListSearch: [],
      searchSelectRowKeys: [],
    });
  }
  //移出
  handleRemoveOut(ids) {
    const { albumId, docStartPage } = this.state;
    const params = {
      albumId: albumId,
      documentIds: ids,
    };
    this.props.dispatch({
      type: 'albumManager/removeAlbumDocList',
      payload: params,
      albumList: {
        startPage: docStartPage,
        pageSize: 10,
        albumId: albumId,
      },
    });
    this.setState({
      checkListDoc: [],
      docSelectRowKeys: [],
    });
  }
  //置顶
  handleToTop(id) {
    const { albumId } = this.state;
    const params = {
      albumId: albumId,
      documentId: id,
      num: 1,
    };
    this.props.dispatch({
      type: 'albumManager/topAlbumDocList',
      payload: params,
      albumList: { albumId: albumId },
    });
  }
  //修改搜索id
  handleIdChange(e) {
    let value = e.target.value;
    const { searchItem } = this.state;
    searchItem.id = value;
    this.setState({
      searchItem: searchItem,
    });
  }
  //修改搜索标题
  handleTitleChange(e) {
    let value = e.target.value;
    const { searchItem } = this.state;
    searchItem.title = value;
    this.setState({
      searchItem: searchItem,
    });
  }
  //修改搜索作者
  handleAuthorChange(e) {
    let value = e.target.value;
    const { searchItem } = this.state;
    searchItem.author = value;
    this.setState({
      searchItem: searchItem,
    });
  }
  //修改搜索时间
  handleDateChange(date, dateString) {
    const { searchItem } = this.state;
    searchItem.startTime = dateString[0];
    searchItem.endTime = dateString[1];
    this.setState({
      searchItem: searchItem,
    });
  }
  //修改搜索分类
  handleInputCateChange(value) {
    const { searchItem } = this.state;
    searchItem.categoryIds = value;
    console.log('searchItem', searchItem);
    this.setState({
      searchItem: searchItem,
    });
  }
  //搜索
  handleSearchList(startPage) {
    const { searchItem, albumId } = this.state;
    const params = {
      categoryIds: searchItem.categoryIds,
      startPage: startPage,
      pageSize: 10,
      documentId: searchItem.id,
      title: searchItem.title,
      author: searchItem.author,
      startTime: searchItem.startTime,
      endTime: searchItem.endTime,
      albumId: albumId,
    };
    this.props.dispatch({
      type: 'albumManager/getAlbumSearchList',
      payload: params,
    });
    this.setState({
      checkListSearch: [],
      searchSelectRowKeys: [],
      searchStartPage: startPage,
    });
  }

  render() {
    const { isLoading } = this.props;
    const categoryList = this.props && this.props.categoryList;
    const categoryOptions =
      categoryList &&
      categoryList.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ));
    const albumDocData = this.props.albumDocData && this.props.albumDocData;
    const docPagination = {
      total: albumDocData && albumDocData.total,
      pageSize: albumDocData && albumDocData.pageSize,
      current: albumDocData && albumDocData.pageNum,
      showTotal: total => `共${total}项`,
      onChange: this.getDocList,
    };
    let albumDocList = albumDocData && albumDocData.list;
    if (albumDocList && albumDocList.length > 0) {
      for (let i = 0; i < albumDocList.length; i++) {
        albumDocList[i].indexs = i + 1;
      }
    }
    const albumSearchData = this.props.albumSearchData && this.props.albumSearchData;
    const albumPagination = {
      total: albumSearchData && albumSearchData.total,
      pageSize: albumSearchData && albumSearchData.pageSize,
      current: albumSearchData && albumSearchData.pageNum,
      showTotal: total => `共${total}项`,
      onChange: this.handleSearchList,
    };
    const albumSearchList = albumSearchData && albumSearchData.list;
    const searchTable = () => '搜索结果';
    const nowTable = () => '栏目内资源列表';
    const { checkListSearch, checkListDoc, searchSelectRowKeys, docSelectRowKeys } = this.state;
    const rowAlbumSearchSelection = {
      selectedRowKeys: searchSelectRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let checkListSearch = selectedRows.map(item => item.id);
        this.setState({
          checkListSearch,
          searchSelectRowKeys: selectedRowKeys,
        });
      },
    };
    const rowAlbumDocSelection = {
      selectedRowKeys: docSelectRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let checkListDoc = selectedRows.map(item => item.id);
        this.setState({
          checkListDoc,
          docSelectRowKeys: selectedRowKeys,
        });
      },
    };

    return (
      <Fragment>
        <PageHeaderWrapper />
        <div className={styles.album_search_box}>
          <Input
            className={styles.search_input}
            placeholder="档案ID"
            onChange={this.handleIdChange}
          />
          <Input
            className={styles.search_input}
            placeholder="档案标题"
            onChange={this.handleTitleChange}
          />
          <Input
            className={styles.search_input}
            placeholder="作者"
            onChange={this.handleAuthorChange}
          />
          <RangePicker className={styles.search_span} onChange={this.handleDateChange} />
          <Select
            placeholder="全部分类"
            style={{ width: 200 }}
            className={styles.search_select}
            mode="multiple"
            onChange={this.handleInputCateChange}
          >
            {categoryOptions}
          </Select>
          <Button
            type="primary"
            className={styles.search_span}
            onClick={() => {
              this.handleSearchList(1);
            }}
          >
            搜索
          </Button>
        </div>
        <div className={styles.table_box}>
          <Button
            type="primary"
            className={styles.table_btn}
            onClick={() => {
              this.handleSearchAdd(checkListSearch);
            }}
          >
            批量添加
          </Button>
          <Table
            rowSelection={rowAlbumSearchSelection}
            dataSource={albumSearchList}
            title={searchTable}
            bordered
            pagination={albumPagination}
            loading={isLoading}
          >
            <Column title="档案ID" dataIndex="id" key="id" />
            <Column title="档案标题" dataIndex="title" key="title" />
            <Column
              title="播放"
              key="url"
              width="100"
              render={item => <audio src={item.url} controls="controls" />}
            />
            <Column title="分类" dataIndex="categoryNames" key="categoryNames" />
            <Column title="更新时间" dataIndex="updateTime" key="updateTime" />
            <Column title="发布时间" dataIndex="publishTime" key="publishTime" />
            <Column title="作者" dataIndex="author" key="author" />
            <Column
              title="操作"
              key=""
              render={item => (
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.handleSearchAdd([item.id]);
                  }}
                >
                  添加
                </a>
              )}
            />
          </Table>
        </div>

        <div className={styles.table_box}>
          <Button
            type="primary"
            className={styles.table_btn}
            onClick={() => {
              this.handleRemoveOut(checkListDoc);
            }}
          >
            批量移出
          </Button>
          <Table
            rowSelection={rowAlbumDocSelection}
            dataSource={albumDocList}
            title={nowTable}
            bordered
            pagination={docPagination}
            loading={isLoading}
          >
            <Column title="顺序" dataIndex="indexs" key="indexs" />
            <Column title="档案ID" dataIndex="id" key="id" />
            <Column title="档案标题" dataIndex="title" key="title" />
            <Column
              title="播放"
              key="url"
              width="100"
              render={item => <audio src={item.url} controls="controls" />}
            />
            <Column title="分类" dataIndex="categoryNames" key="categoryNames" />
            <Column title="添加时间" dataIndex="createTime" key="createTime" />
            <Column title="作者" dataIndex="author" key="author" />
            <Column
              title="状态"
              key="status"
              render={item => {
                if (item.status === 0) {
                  return <span>未发布</span>;
                } else if (item.status === 1) {
                  return <span>已发布</span>;
                } else {
                  return <span>已下架</span>;
                }
              }}
            />
            <Column
              title="操作"
              key=""
              render={item => {
                return (
                  <span>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.handleRemoveOut([item.id]);
                      }}
                    >
                      移出
                    </a>
                    <Divider type="vertical" />
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.handleToTop(item.id);
                      }}
                    >
                      置顶
                    </a>
                  </span>
                );
              }}
            />
          </Table>
        </div>
      </Fragment>
    );
  }
}
export default AlbumEdit;
