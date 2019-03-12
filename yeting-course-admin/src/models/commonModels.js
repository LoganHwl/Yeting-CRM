export default {
  namespace: 'common',
  state: {
    success: [],
    error: [],
    info: [],
  },
  effects: {},
  reducers: {
    SUCCESS_MSG(state, { msg }) {
      return { ...state, success: [msg] };
    },
    FAILED_MSG(state, { msg }) {
      return { ...state, error: [msg] };
    },
    INFO_MSG(state, { msg }) {
      return { ...state, info: [msg] };
    },
    CLEAR_MSG(state, { payload }) {
      return { ...state, [payload]: [] };
    },
    RESET_COMMON_DATA(state, { payload, instance }) {
      if (instance) {
        return { ...state, [instance]: { ...state[instance], ...payload } };
      }
      return { ...state, ...payload };
    },
  },
};
