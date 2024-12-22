import berterMcok from 'better-mock';

export function mockRequest() {
  return new Promise<any>((resolve, reject) => {
    const list = berterMcok.mock({
      'list|2': [
        {
          key: '@id',
          name: '@cname',
          'age|10-60': 10,
          birthday: `@date`,
          address: `@county(true)`,
        },
      ],
    }).list;
    setTimeout(() => {
      resolve({
        data: list,
        success: true,
        message: '成功',
      });
    }, 500);
  });
}
