import { getUserList } from '@/services/api';

export default {
  namespace: 'userList',

  state: {
    dataList: [],
  },

  effects: {
    *getUserList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
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
