/** 模拟ajax请求 */
export const mockAjax = (flag?: boolean) => {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      if (flag) {
        resolve({
          code: 200,
          data: {
            id: 1,
            name: '张三',
            age: 18,
            token: Math.random(),
          },
        });
      } else {
        rejected({
          code: 400,
          msg: '请求失败',
        });
      }
    }, 500);
  });
};
