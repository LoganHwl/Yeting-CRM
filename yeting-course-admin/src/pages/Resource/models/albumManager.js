import * as servicesApi from '@/services/api';

export default {
  namespace: 'albumManager',

  state: {
    dataList: {},
    categoryList: [], //分类数据
    detailData: {}, //详情数据
    albumDocData: {}, //栏目内资源数据
    albumSearchData: {}, //搜索结果数据
  },

  effects: {
    //获取专辑列表
    *getAlbumList({ payload }, { call, put }) {
      const response = yield call(servicesApi.getAlbumList, payload);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //获取分类数据
    *getCategoryList({ payload }, { call, put }) {
      const category = yield call(servicesApi.getCategoryList, payload);
      yield put({
        type: 'GET_CATEGORY',
        payload: category,
      });
    },
    //新增专辑
    *addAlbum({ payload }, { call, put }) {
      const addData = yield call(servicesApi.addAlbum, payload);
      const response = yield call(servicesApi.getAlbumList);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //更新专辑
    *updateAlbum({ payload }, { call, put }) {
      const updateData = yield call(servicesApi.updateAlbum, payload);
      const response = yield call(servicesApi.getAlbumList);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //开启专辑
    *openAlbum({ payload, pageData }, { call, put }) {
      const openData = yield call(servicesApi.openAlbum, payload);
      const response = yield call(servicesApi.getAlbumList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //关闭专辑
    *closeAlbum({ payload, pageData }, { call, put }) {
      const closeData = yield call(servicesApi.closeAlbum, payload);
      const response = yield call(servicesApi.getAlbumList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },

    //编辑页面
    //获取专辑详情
    *getAlbumDetail({ payload }, { call, put }) {
      const response = yield call(servicesApi.getAlbumDetail, payload);
      yield put({
        type: 'GET_DETAIL',
        payload: response,
      });
      return response;
    },
    //查询栏目内资源列表
    *getAlbumDocList({ payload }, { call, put }) {
      const response = yield call(servicesApi.getAlbumDocList, payload);
      yield put({
        type: 'GET_ALBUMDOCLIST',
        payload: response,
      });
    },
    //搜索结果数据
    *getAlbumSearchList({ payload }, { call, put }) {
      const response = yield call(servicesApi.getAlbumSearchList, payload);
      yield put({
        type: 'GET_ALBUMSEARCHLIST',
        payload: response,
      });
    },
    //添加
    *addAlbumDocList({ payload, albumList }, { call, put }) {
      const addData = yield call(servicesApi.addAlbumDocList, payload);
      const response = yield call(servicesApi.getAlbumDocList, albumList);
      yield put({
        type: 'GET_ALBUMDOCLIST',
        payload: response,
      });
    },
    //移出
    *removeAlbumDocList({ payload, albumList }, { call, put }) {
      const removeData = yield call(servicesApi.removeAlbumDocList, payload);
      const response = yield call(servicesApi.getAlbumDocList, albumList);
      yield put({
        type: 'GET_ALBUMDOCLIST',
        payload: response,
      });
    },
    //置顶
    *topAlbumDocList({ payload, albumList }, { call, put }) {
      const removeData = yield call(servicesApi.topAlbumDocList, payload);
      const response = yield call(servicesApi.getAlbumDocList, albumList);
      yield put({
        type: 'GET_ALBUMDOCLIST',
        payload: response,
      });
    },
  },

  reducers: {
    GET_LIST(state, { payload }) {
      return { ...state, dataList: payload };
    },
    GET_DETAIL(state, { payload }) {
      return { ...state, detailData: payload };
    },
    GET_CATEGORY(state, { payload }) {
      return { ...state, categoryList: payload };
    },
    GET_ALBUMDOCLIST(state, { payload }) {
      return { ...state, albumDocData: payload };
    },
    GET_ALBUMSEARCHLIST(state, { payload }) {
      return { ...state, albumSearchData: payload };
    },
  },
};
