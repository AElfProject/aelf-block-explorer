import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    children: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    children: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Address',
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
  {
    key: '5',
    label: 'Remark',
    children: 'empty',
  },
];
export default function OverView() {
  return (
    <div>
      <Descriptions
        contentStyle={{
          fontSize: 14,
          lineHeight: '22px',
          color: '#252525',
          paddingBottom: 16,
        }}
        labelStyle={{
          fontSize: 10,
          lineHeight: '18px',
          color: '#858585',
        }}
        colon={false}
        column={1}
        layout="vertical"
        items={items}
      />
    </div>
  );
}
