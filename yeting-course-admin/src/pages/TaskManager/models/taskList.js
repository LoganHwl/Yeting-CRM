import {
  getTaskList,
  pushTaskList,
  removeTaskList,
  addTaskList,
  getTaskDetail,
  getCategoryList,
  updateTaskList,
} from '@/services/api';

export default {
  namespace: 'taskList',

  state: {
    dataList: [], //列表数据
    categoryList: [], //分类数据
  },

  effects: {
    //获取列表数据
    *getList({ payload }, { call, put }) {
      const response = yield call(getTaskList, payload);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //发布档案
    *pushTask({ payload, pageData }, { call, put }) {
      const pushData = yield call(pushTaskList, payload);
      const response = yield call(getTaskList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    //下架档案
    *removeTask({ payload, pageData }, { call, put }) {
      const removeData = yield call(removeTaskList, payload);
      const response = yield call(getTaskList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
      return removeData;
    },
    //获取详情数据
    *getDetailData({ payload }, { call, put }) {
      return yield call(getTaskDetail, payload);
      // yield put({
      //   type: 'GET_DETAIL',
      //   payload: detail,
      // });
    },
    //获取分类数据
    *getCategoryList({ payload }, { call, put }) {
      const category = yield call(getCategoryList, payload);
      yield put({
        type: 'GET_CATEGORY',
        payload: category,
      });
    },
    //新增档案
    *addList({ payload }, { call }) {
      return yield call(addTaskList, payload);
    },
    //更新档案
    *updateList({ payload }, { call }) {
      return yield call(updateTaskList, payload);
    },
  },

  reducers: {
    GET_LIST(state, { payload }) {
      return { ...state, dataList: payload };
    },
    // GET_DETAIL(state, { payload }) {
    //   return { ...state, detailData: payload }
    // },
    GET_CATEGORY(state, { payload }) {
      return { ...state, categoryList: payload };
    },
  },
};
