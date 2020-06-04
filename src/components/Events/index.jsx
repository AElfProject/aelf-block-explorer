/**
 * @file event item
 * @author atom-yang
 */
import React  from 'react';
import PropTypes from 'prop-types';
import EventItem from "../EventItem";

const Events = props => {
    const {
        list
    } = props;
    return (
        <div className="event-list">
            {list.map(item => (<EventItem {...item} />))}
        </div>
    );
};

Events.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        Indexed: PropTypes.array,
        NoIndexed: PropTypes.string,
        Name: PropTypes.string.isRequired,
        Address: PropTypes.string.isRequired
    })).isRequired
};

export default Events;
