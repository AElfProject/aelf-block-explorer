/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:06:09
 * @FilePath: /aelf-block-explorer/src/components/Events/index.tsx
 * @Description: link to address url and can copy
 */
import React from 'react';
import PropTypes from 'prop-types';
import EventItem from '../EventItem';
import CopyButton from '../CopyButton/CopyButton';
import Link from 'next/link';
import addressFormat from 'utils/addressFormat';

const Events = (props) => {
  const { list } = props;
  return (
    <div className="event-list">
      {list.map((item, index) => (
        <div key={index}>
          <div className="info">
            <span className="label">Address: </span>
            <div>
              <Link className="info" href={`/address/${item.Address}`} title={addressFormat(item.Address)}>
                {addressFormat(item.Address)}
              </Link>
              <CopyButton value={addressFormat(item.Address)} />
            </div>
          </div>
          <div className="info">
            <span className="label">Name: </span>
            <span className="info">{item.Name}</span>
          </div>
          <EventItem {...item} />
        </div>
      ))}
    </div>
  );
};

Events.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      Indexed: PropTypes.array,
      NoIndexed: PropTypes.string,
      Name: PropTypes.string.isRequired,
      Address: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Events;
