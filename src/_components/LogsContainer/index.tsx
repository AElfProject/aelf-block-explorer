import React from 'react';
import { ILogsProps } from './type';
import DetailContainer from '@_components/DetailContainer';
import Link from 'next/link';
import addressFormat from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import LogItems from './logItems';
function LogsContainer({ Logs = [] }: { Logs: ILogsProps[] }) {
  return (
    <div className="log-container">
      <div className="log-list">
        {Logs.map((item, index) => (
          <div key={item.address} className="">
            <DetailContainer
              infoList={[
                {
                  label: 'Address',
                  value: (
                    <div>
                      <Link href={`/address${addressFormat(item.address)}`}>{addressFormat(item.address)}</Link>
                      <Copy value={addressFormat(item.address)} />
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
                      <div className="mb-2">{item.name}</div>
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
                    label: 'divider' + item.address,
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
