import { routerRedux } from 'dva/router';
import {
  getAudioList,
  audioOnline,
  audioOffline,
  audioDelete,
  getAudioDetail,
  addAudio,
  updateAudio,
} from '@/services/api';

export default {
  namespace: 'audioList',

  state: {
    search: {},
    startPage: 1,
    pageSize: 10,
    audioList: {},
    audioDetail: {},
  },

  effects: {
    *getAudioList({ payload }, { call, put }) {
      try {
        const audioList = yield call(getAudioList, payload);
        yield put({
          type: 'GET_AUDIO_LIST',
          audioList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getAudioDetail({ payload }, { call, put }) {
      try {
        const audioDetail = yield call(getAudioDetail, payload);
        yield put({
          type: 'GET_AUDIO_DETAIL',
          audioDetail,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *audioOnline({ payload }, { call, put }) {
      try {
        yield call(audioOnline, payload);

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
    *audioOffline({ payload }, { call, put }) {
      try {
        yield call(audioOffline, payload);

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
    *audioDelete({ payload }, { call, put }) {
      try {
        yield call(audioDelete, payload);

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
    *audioAdd({ payload, run }, { call, put }) {
      try {
        yield call(run == 'add' ? addAudio : updateAudio, payload);

        yield put(
          routerRedux.push({
            pathname: '/audio/audio-list',
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
  },

  reducers: {
    SEARCH_CONDITION_CHANGE(state, { payload }) {
      return { ...state, search: { ...state.search, ...payload } };
    },
    CHANGE_PAGENO(state, { startPage }) {
      return { ...state, startPage };
    },
    GET_AUDIO_LIST(state, { audioList }) {
      return { ...state, audioList };
    },
    GET_AUDIO_DETAIL(state, { audioDetail }) {
      return { ...state, audioDetail };
    },
    AUDIO_DETAIL_CHANGE(state, { payload }) {
      return { ...state, audioDetail: { ...state.audioDetail, ...payload } };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, audioList: {}, audioDetail: {} };
    },
  },
};
