import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
// import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin, userLogout,testLogin } from '@/services/adminApi';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
   // 登陆测试
    *login({ payload }, { call, put }) {
      const response = yield call(testLogin, payload);
      console.log(response)
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code == '0') {
        const { nickName, id, token } = response.data.userInfo;

        localStorage.setItem('userName', nickName);
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', id);
        let arr =[]
        response.data.menuInfo.map(item=>{
          arr.push( item.id)

        })
        localStorage.setItem('menuIdArr',JSON.stringify(arr));
        let idArr = JSON.parse(localStorage.getItem('menuIdArr'));
        idArr.includes(1)===true?console.log(idArr):console.log(999)
        
        // debugger

        yield put(
          routerRedux.push({
            pathname: '/order/order-list',
          })
        );

        yield put({
          type: 'common/SUCCESS_MSG',
          msg: '登录成功',
        });
      } else {
        // 登录失败
        yield put({
          type: 'common/FAILED_MSG',
          msg: response.msg,
        });
      }
    },

    // *login({ payload }, { call, put }) {
    //   const response = yield call(userLogin, payload);
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: response,
    //   });
    //   // Login successfully
    //   if (response.code == '0') {
    //     const { account, userId, token } = response.data;

    //     localStorage.setItem('userName', account);
    //     localStorage.setItem('userToken', token);
    //     localStorage.setItem('userId', userId);

    //     yield put(
    //       routerRedux.push({
    //         pathname: '/order/order-list',
    //       })
    //     );

    //     yield put({
    //       type: 'common/SUCCESS_MSG',
    //       msg: '登录成功',
    //     });
    //   } else {
    //     // 登录失败
    //     yield put({
    //       type: 'common/FAILED_MSG',
    //       msg: response.msg,
    //     });
    //   }
    // },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(userLogout);
      if (response) {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
      // reloadAuthorized();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.code == 0 ? 'isLogin' : 'noLogin',
      };
    },
  },
};
