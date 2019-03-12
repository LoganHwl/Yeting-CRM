import { getMessageList } from '@/services/api';

export default {
  namespace: 'messageList',

  state: {
    search: {},
    startPage: 1,
    pageSize: 10,
    messageList: {},
  },

  effects: {
    *getMessageList({ payload }, { call, put }) {
      try {
        const messageList = yield call(getMessageList, payload);
        yield put({
          type: 'GET_MESSAGE_LIST',
          messageList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
  },

  reducers: {
    SEARCH_CONDITION_CHANGE(state, { payload }) {
      return { ...state, search: { ...state.search, ...payload } };
    },
    CHANGE_PAGENO(state, { startPage }) {
      return { ...state, startPage };
    },
    GET_MESSAGE_LIST(state, { messageList }) {
      return { ...state, messageList };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, messageList: {} };
    },
  },
};
