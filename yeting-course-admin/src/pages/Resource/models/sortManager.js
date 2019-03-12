import { getSortList, addSort, updateSort, openSort, closeSort } from '@/services/api';

export default {
  namespace: 'sortManager',

  state: {
    dataList: {},
  },

  effects: {
    *getSortList({ payload }, { call, put }) {
      const response = yield call(getSortList, payload);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    *addSort({ payload }, { call, put }) {
      const addData = yield call(addSort, payload);
      const response = yield call(getSortList);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    *updateSort({ payload }, { call, put }) {
      const updateData = yield call(updateSort, payload);
      const response = yield call(getSortList);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    *openSort({ payload, pageData }, { call, put }) {
      const openData = yield call(openSort, payload);
      const response = yield call(getSortList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
    *closeSort({ payload }, { call, put }) {
      const closeData = yield call(closeSort, payload);
      const response = yield call(getSortList, pageData);
      yield put({
        type: 'GET_LIST',
        payload: response,
      });
    },
  },

  reducers: {
    GET_LIST(state, { payload }) {
      return { ...state, dataList: payload };
    },
  },
};
