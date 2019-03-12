import { routerRedux } from 'dva/router';
import {
  getCourseList,
  courseOnline,
  courseOffline,
  courseDelete,
  courseRank,
  getCourseDetail,
  addCourse,
  updateCourse,
  getChapterList,
  chapterDelete,
  chapterRank,
  addChapter,
  updateChapter,
  chapterRefRank,
  chapterRefDelete,
  getChapterRefList,
  addChapterRef,
} from '@/services/api';

export default {
  namespace: 'courseList',

  state: {
    search: {},
    startPage: 1,
    pageSize: 10,
    courseList: {},
    courseDetail: {},
    chapterList: {},
    chapterRefList: {}, // 章节添加课件列表
  },

  effects: {
    *getCourseList({ payload }, { call, put }) {
      try {
        const courseList = yield call(getCourseList, payload);
        yield put({
          type: 'GET_COURSE_LIST',
          courseList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getCourseDetail({ payload }, { call, put }) {
      try {
        const courseDetail = yield call(getCourseDetail, payload);
        yield put({
          type: 'GET_COURSE_DETAIL',
          courseDetail,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *courseOnline({ payload }, { call, put }) {
      try {
        yield call(courseOnline, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '上架成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '上架失败，请稍后重试 0_0',
        });
      }
    },
    *courseOffline({ payload }, { call, put }) {
      try {
        yield call(courseOffline, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '下架成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '下架失败，请稍后重试 0_0',
        });
      }
    },
    *courseDelete({ payload }, { call, put }) {
      try {
        yield call(courseDelete, payload);

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
    *courseRank({ payload }, { call, put }) {
      try {
        yield call(courseRank, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '排序成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '排序失败，请稍后重试 0_0',
        });
      }
    },
    *courseAdd({ payload, run }, { call, put }) {
      try {
        yield call(run == 'add' ? addCourse : updateCourse, payload);

        yield put(
          routerRedux.push({
            pathname: '/course/course-list',
          })
        );

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
    *getChapterList({ payload }, { call, put }) {
      try {
        const chapterList = yield call(getChapterList, payload);
        yield put({
          type: 'GET_CHAPTER_LIST',
          chapterList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *chapterDelete({ payload }, { call, put }) {
      try {
        yield call(chapterDelete, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '移除成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '移除失败，请稍后重试 0_0',
        });
      }
    },
    *chapterRank({ payload }, { call, put }) {
      try {
        yield call(chapterRank, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '排序成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '排序失败，请稍后重试 0_0',
        });
      }
    },
    *chapterAdd({ payload, run }, { call, put }) {
      try {
        yield call(run == 'add' ? addChapter : updateChapter, payload);

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
    *chapterRefRank({ payload }, { call, put }) {
      try {
        yield call(chapterRefRank, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '排序成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '排序失败，请稍后重试 0_0',
        });
      }
    },
    *chapterRefDelete({ payload }, { call, put }) {
      try {
        yield call(chapterRefDelete, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '移除成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '移除失败，请稍后重试 0_0',
        });
      }
    },
    *getChapterRefList({ payload }, { call, put }) {
      try {
        const chapterRefList = yield call(getChapterRefList, payload);
        yield put({
          type: 'GET_CHAPTER_REF_LIST',
          chapterRefList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *addChapterRef({ payload }, { call, put }) {
      try {
        yield call(addChapterRef, payload);

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '添加成功 ~_~',
        });
      } catch (err) {
        const { msg } = err.response || {};
        yield put({
          type: 'common/FAILED_MSG',
          msg: msg || '添加失败，请稍后重试 0_0',
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
    GET_COURSE_LIST(state, { courseList }) {
      return { ...state, courseList };
    },
    GET_COURSE_DETAIL(state, { courseDetail }) {
      return { ...state, courseDetail };
    },
    GET_CHAPTER_LIST(state, { chapterList }) {
      return { ...state, chapterList };
    },
    GET_CHAPTER_REF_LIST(state, { chapterRefList }) {
      return { ...state, chapterRefList };
    },
    COURSE_DETAIL_CHANGE(state, { payload }) {
      return { ...state, courseDetail: { ...state.courseDetail, ...payload } };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, courseList: {}, courseDetail: {} };
    },
  },
};
