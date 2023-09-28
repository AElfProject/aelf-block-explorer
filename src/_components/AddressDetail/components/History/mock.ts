import { IHistory } from './type';
export default async function fetchData(): Promise<IHistory[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = [
    {
      id: 1,
      contractName: 'Genesis',
      address: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
      codeHash: '50f7887ea137a5561334e8c5b14c78a4476a956491932219af6b819bbd080083',
      author: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
      event: 'CodeUpdated',
      txId: '0ccf3163e9824cf2b07bc4975063e82e9486e583c252203925c0bd03ce76ffb2',
      blockHeight: 161934762,
      version: '1.5.0.0',
      updateTime: '2023/07/26 12:03:48+00:00',
    },
    {
      address: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
      author: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
      blockHeight: 145336811,
      codeHash: '128055f9d7f43824c8398dcacf6862c6dd429e2e7b02bb9b290a05418662ca58',
      contractName: 'Genesis',
      event: 'CodeUpdated',
      id: 52,
      txId: 'ab2d8d28bb97c45f48f2ac5e7b5f0170133b59991bb40c032726f25c78232e67',
      updateTime: '2023/04/17 03:39:00+00:00',
      version: '4',
    },
  ];

  return res;
}
