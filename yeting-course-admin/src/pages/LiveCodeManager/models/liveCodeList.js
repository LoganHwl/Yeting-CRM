import {
  getLiveCodeList,
  getCodeCourseList,
  addCode,
  updateCode,
  codeDelete,
} from '@/services/api';

export default {
  namespace: 'liveCodeList',

  state: {
    search: {},
    startPage: 1,
    pageSize: 10,
    liveCodeList: {},
    codeCourseList: [], // 添加/编辑活码时的关联课程列表
  },

  effects: {
    *getLiveCodeList({ payload }, { call, put }) {
      try {
        const liveCodeList = yield call(getLiveCodeList, payload);
        yield put({
          type: 'GET_LIVE_CODE_LIST',
          liveCodeList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getCodeCourseList({ payload }, { call, put }) {
      try {
        const codeCourseList = yield call(getCodeCourseList, payload);
        yield put({
          type: 'GET_CODE_COURSE_LIST',
          codeCourseList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *codeAdd({ payload, run }, { call, put }) {
      try {
        yield call(run == 'add' ? addCode : updateCode, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '保存成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '添加失败，请稍后重试 0_0',
        });
      }
    },
    *codeDelete({ payload }, { call, put }) {
      try {
        yield call(codeDelete, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '删除成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '删除失败，请稍后重试 0_0',
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
    GET_LIVE_CODE_LIST(state, { liveCodeList }) {
      return { ...state, liveCodeList };
    },
    GET_CODE_COURSE_LIST(state, { codeCourseList }) {
      return { ...state, codeCourseList };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, liveCodeList: {} };
    },
  },
};
