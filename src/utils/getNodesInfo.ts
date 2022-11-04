import { get } from 'utils/axios';
import config from 'constants/config/config';
import Cookies from 'js-cookie';
const nodesInfoProvider = '/nodes/info';
interface NodesInfoItem {
  api_domain: string;
  api_ip: string;
  chain_id: string;
  contract_address: string;
  create_time: string;
  id: number;
  owner: string;
  rpc_domain: string;
  rpc_ip: string;
  status: number;
  token_name: string;
}
interface NodesInfoDto {
  list: NodesInfoItem[];
}
export async function getNodesInfo() {
  const nodesInfo = (await get(nodesInfoProvider)) as NodesInfoDto;
  if (nodesInfo && nodesInfo.list) {
    const nodesInfoList = nodesInfo.list;
    localStorage.setItem('nodesInfo', JSON.stringify(nodesInfoList));
    const nodeInfo: NodesInfoItem = nodesInfoList.find((item) => {
      if (item.chain_id === config.CHAIN_ID) {
        return item;
      }
    })!;
    const { contract_address, chain_id } = nodeInfo;
    localStorage.setItem('currentChain', JSON.stringify(nodeInfo));
    Cookies.set('aelf_ca_ci', contract_address + chain_id);
  }
}
