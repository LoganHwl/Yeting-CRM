
// let idArr = JSON.parse(localStorage.getItem('menuIdArr'));

export default [
  // 登录
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // admin
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/order/order-list' },
      // { path: '/', redirect: '/user' },
      // 订单管理
      {
        path: '/order',
        name: 'order',
        
        routes: [
          {
            path: '/order/order-list',
            name: 'order-list',
            component: './OrderManager/OrderList',
            hideInMenu: true,
            // authority: [`${JSON.parse(localStorage.getItem('menuIdArr')).includes(1)===true?'':''}`],
          },
          /*
          {
            path: '/task/task-edit',
            component: './TaskManager/TaskEdit',
          },
          */
        ],
      },
      // 课程管理
      {
        path: '/course',
        name: 'course',
        routes: [
          {
            path: '/course/course-list',
            name: 'course-list',
            component: './CourseManager/CourseList',
          },
          {
            path: '/course/course-list/edit',
            component: './CourseManager/CourseEdit',
          },
          {
            path: '/course/course-list/content',
            component: './CourseManager/CourseContent',
          },
        ],
      },
      // 音频管理
      {
        path: '/audio',
        name: 'audio',
        routes: [
          {
            path: '/audio/audio-list',
            name: 'audio-list',
            component: './AudioManager/AudioList',
          },
          {
            path: '/audio/audio-list/edit',
            component: './AudioManager/AudioEdit',
          },
        ],
      },
      // 活码管理
      {
        path: '/live-code',
        name: 'live-code',
        routes: [
          {
            path: '/live-code/live-code-list',
            name: 'live-code-list',
            component: './LiveCodeManager/LiveCodeList',
          },
        ],
      },
      // 用户管理
      {
        path: '/user-manager',
        name: 'user',
        routes: [
          {
            path: '/user-manager/user-list',
            name: 'user-list',
            component: './UserManager/UserList',
          },
        ],
      },
      // 数据统计
      {
        path: '/data',
        name: 'data',
        routes: [
          {
            path: '/data/message-list',
            name: 'message-list',
            component: './DataManager/MessageList',
          },
        ],
      },
    ],
  },
  { component: '404' },
];
