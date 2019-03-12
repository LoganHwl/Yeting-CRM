import { stringify } from 'qs';
import request from '@/utils/request';

//用户列表
export async function getUserList(params) {
  return request(`/user/page?${stringify(params)}`);
}

// 获取音频列表
export async function getAudioList(params) {
  return request(`/item/page?${stringify(params)}`);
}

// 上架音频
export async function audioOnline(params) {
  return request(`/item/online`, {
    method: 'POST',
    body: params,
  });
}

// 下架音频
export async function audioOffline(params) {
  return request(`/item/offline`, {
    method: 'POST',
    body: params,
  });
}

// 删除音频
export async function audioDelete(params) {
  return request(`/item/delete/${params}`);
}

// 获取音频详情
export async function getAudioDetail(params) {
  return request(`/item/detail/${params}`);
}

// 新增音频
export async function addAudio(params) {
  return request(`/item/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新音频
export async function updateAudio(params) {
  return request(`/item/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取课程列表
export async function getCourseList(params) {
  return request(`/course/page?${stringify(params)}`);
}

// 课程上架
export async function courseOnline(params) {
  return request(`/course/online`, {
    method: 'POST',
    body: params,
  });
}

// 课程下架
export async function courseOffline(params) {
  return request(`/course/offline`, {
    method: 'POST',
    body: params,
  });
}

// 删除课程
export async function courseDelete(params) {
  return request(`/course/delete/${params}`);
}

// 课程排序
export async function courseRank(params) {
  return request(`/course/rank`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取课程详情
export async function getCourseDetail(params) {
  return request(`/course/detail/${params}`);
}

// 新增课程
export async function addCourse(params) {
  return request(`/course/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新课程
export async function updateCourse(params) {
  return request(`/course/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取章节列表
export async function getChapterList(params) {
  return request(`/chapterRef/page?${stringify(params)}`);
}

// 删除章节
export async function chapterDelete(params) {
  return request(`/chapter/delete/${params}`);
}

// 章节排序
export async function chapterRank(params) {
  return request(`/chapter/rank`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 添加章节
export async function addChapter(params) {
  return request(`/chapter/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编辑章节
export async function updateChapter(params) {
  return request(`/chapter/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 章节课件的排序
export async function chapterRefRank(params) {
  return request(`/chapterRef/rank`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 章节课件的删除
export async function chapterRefDelete(params) {
  return request(`/chapterRef/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取章节添加的课件列表
export async function getChapterRefList(params) {
  return request(`/chapterRef/getItem?${stringify(params)}`);
}

// 章节添加课件
export async function addChapterRef(params) {
  return request(`/chapterRef/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取订单列表
export async function getOrderList(params) {
  return request(`/order/page?${stringify(params)}`);
}

// 获取订单统计
export async function getOrderStatistics(params) {
  return request(`/order/queryStaic?${stringify(params)}`);
}

// 订单退款/返现
export async function orderRefund(params) {
  return request(`/order/refund`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取活码列表
export async function getLiveCodeList(params) {
  return request(`/code/page?${stringify(params)}`);
}

// 获取课程列表
export async function getCodeCourseList(params) {
  return request(`/code/getCourse?${stringify(params)}`);
}

// 添加活码
export async function addCode(params) {
  return request(`/code/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 修改活码
export async function updateCode(params) {
  return request(`/code/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除活码
export async function codeDelete(params) {
  return request(`/code/delete?${stringify(params)}`, {
    method: 'POST',
  });
}

// 获取微信消息推送统计
export async function getMessageList(params) {
  return request(`/message/page?${stringify(params)}`);
}

// 文件上传
export async function upload(params) {
  return request(`/file/upload`, {
    method: 'POST',
    body: params,
  });
}
