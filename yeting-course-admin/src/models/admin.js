import // getUserListApi,
'@/services/adminApi';

export default {
  namespace: 'admin',

  state: {},

  effects: {
    /*
    *getUserList({ payload }, { call, put }) {
      try {
        const userList = yield call(getUserListApi, payload);
        yield put({
          type: 'GET_USER_LIST',
          userList,
        });
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    */
    /*
    *userAdd({ payload, run }, { call, put }) {
      try {
        yield call(run == 'add' ? addUser : updateUser, payload);

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
    */
  },

  reducers: {
    /*
    GET_USER_LIST(state, { userList }) {
      return { ...state, userList };
    },
    CLEAR_TOPIC_INFO(state) {
      return { ...state, topicList: {} };
    },
    */
  },

  subscriptions: {},
};
