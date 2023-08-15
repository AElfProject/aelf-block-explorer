const clsPrefix = 'home-latest';
import './index.css';
export default function Latest() {
  const blocks = [
    {
      blockHeight: 123,
      timestamp: '1111111',
      txns: 222,
      reward: '123',
      producer: {
        name: 'hehe',
        address: 'www.baidu.com',
      },
    },
  ];
  return (
    <div className={clsPrefix}>
      <div className="title">Latest Blocks</div>
      <div className="content">
        {blocks.map((ele) => {
          return <div key={ele.blockHeight}>123</div>;
        })}
      </div>
      <div className="link">View All Blocks</div>
    </div>
  );
}
