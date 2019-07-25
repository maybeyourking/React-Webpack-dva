const isDev = process.env.NODE_ENV === 'development';//判断当前是什么环境

const baseUrl = isDev ? 'https://easy-mock.com/mock/5c94d748e407a01199d301e7/admin' : 'https://easy-mock.com/mock/5c94d748e407a01199d301e7/admin';

export default baseUrl;