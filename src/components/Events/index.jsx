/**
 * @file event item
 * @author atom-yang
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EventItem from "../EventItem";
import CopyButton from "../CopyButton/CopyButton";
import addressFormat from "../../utils/addressFormat";

const Events = (props) => {
  const { list } = props;
  return (
    <div className="event-list">
      {list.map((item) => (
        <div key={item.address}>
          <div className="info">
            <span className="label">Address: </span>
            <div>
              <Link
                className="info"
                to={`/address/${addressFormat(item.Address)}`}
                title={addressFormat(item.Address)}
              >
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
  list: PropTypes.arrayOf(PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    Indexed: PropTypes.array,
    NoIndexed: PropTypes.string,
    Name: PropTypes.string.isRequired,
    Address: PropTypes.string.isRequired,
  })).isRequired,
};

export default Events;
