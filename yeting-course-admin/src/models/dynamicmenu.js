import { getDynamicmenu } from '@/services/dynamicMenu';

export default {
  namespace: 'dynamicmenu',

  state: {
    menuData: [],
  },

  effects: {
    *getDynamicmenu(_, { call, put }) {
      const response = yield call(getDynamicmenu);
      
      // {
      //   path: '/course',
      //   name: 'course',
      //   routes: [
      //     {
      //       path: '/course/course-list',
      //       name: 'course-list',
      //       component: './CourseManager/CourseList',
      //       authority: ['admin'],
      //     },
      //     {
      //       path: '/course/course-list/edit',
      //       component: './CourseManager/CourseEdit',
      //     },
      //     {
      //       path: '/course/course-list/content',
      //       component: './CourseManager/CourseContent',
      //     },
      //   ],
      // },
      let res =[]
      response.data.menuInfo.map(item=>{
        let str={}
        str.path='/course';
        str.name='course';
res.push(str)
      })
      console.log(res)
      debugger
      yield put({
        type: 'getDynamicmenuSuccess',
        payload: res,
      });
    },
  },

  reducers: {
    getDynamicmenuSuccess(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
