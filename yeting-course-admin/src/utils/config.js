export const HOST =
  ENV === 'prod'
    ? 'https://pay.yetingfm.com/pay-admin/'
    : ENV === 'dev'
      ? 
      // 'https://micro.yetingfm.com/pay-admin'
      'https://micro.yetingfm.com/crm'
      : '';
