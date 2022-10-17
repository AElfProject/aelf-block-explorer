import dynamic from 'next/dynamic';
const Txs = dynamic(import('page-components/Txs/TransactionList'));
export default Txs;
