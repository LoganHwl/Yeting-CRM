import { getOrderList, getOrderStatistics, orderRefund } from '@/services/api';

export default {
  namespace: 'orderList',

  state: {
    search: {},
    startPage: 1,
    pageSize: 10,
    orderList: {},
    orderStatistics: {},
  },

  effects: {
    *getOrderList({ payload }, { call, put }) {
      try {
        const orderList = yield call(getOrderList, payload);
        yield put({
          type: 'GET_ORDER_LIST',
          orderList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getOrderStatistics({ payload }, { call, put }) {
      try {
        const orderStatistics = yield call(getOrderStatistics, payload);
        yield put({
          type: 'GET_ORDER_STATISTICS',
          orderStatistics,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *orderRefund({ payload }, { call, put }) {
      try {
        const response = yield call(orderRefund, payload);

        if (response.code == 0) {
          yield put({
            type: 'common/SUCCESS_MSG',
            msg: payload.type == 2 ? '退款成功 ~_~' : '返现成功 ~_~',
          });
        } else {
          yield put({
            type: 'common/FAILED_MSG',
            msg: response.msg,
          });
        }
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '操作失败，请稍后重试 0_0',
        });
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
    GET_ORDER_LIST(state, { orderList }) {
      return { ...state, orderList };
    },
    GET_ORDER_STATISTICS(state, { orderStatistics }) {
      return { ...state, orderStatistics };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, orderList: {} };
    },
  },
};
