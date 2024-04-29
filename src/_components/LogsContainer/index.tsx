import React from 'react';
import { ILogsProps } from './type';
import DetailContainer from '@_components/DetailContainer';
import Link from 'next/link';
import addressFormat from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import LogItems from './logItems';
import { useParams } from 'next/navigation';
import ContractToken from '@_components/ContractToken';
function LogsContainer({ Logs = [] }: { Logs: ILogsProps[] }) {
  const { chain } = useParams();
  return (
    <div className="log-container">
      <div className="log-list">
        {Logs.map((item, index) => (
          <div key={item.contractInfo?.address} className="">
            <DetailContainer
              infoList={[
                {
                  label: 'Address',
                  value: (
                    <div>
                      <ContractToken
                        address={item.contractInfo.address}
                        name={item.contractInfo.name}
                        type={item.contractInfo.addressType}
                        chainId={chain as string}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <DetailContainer
              infoList={[
                {
                  label: 'Name',
                  value: (
                    <div className="name-container">
                      <div className="mb-2">{item.eventName}</div>
                      <LogItems data={item} />
                    </div>
                  ),
                },
              ]}
            />
            {index !== Logs.length - 1 && (
              <DetailContainer
                infoList={[
                  {
                    label: 'divider' + item.contractInfo?.address,
                    value: 'divider',
                  },
                ]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default React.memo(LogsContainer);
