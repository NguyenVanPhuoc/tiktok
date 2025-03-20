import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import * as accountServices from '~/services/accountService';

const cx = classNames.bind(styles);

function FollowingAccounts({ label }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const result = await accountServices.get('t', 'less');
            setUsers(result);
            setLoading(false);
        };

        fetchApi();
    }, []);

    const visibleUsers = showAll ? users : users.slice(0, 4);
    const shouldShowToggleButton = users.length > 4;

    return (
        <div className={cx("wrapper")}>
            <p className={cx("label")}>{label}</p>

            {loading ? (
                <p>Loading...</p>
            ) : visibleUsers.length > 0 ? (
                visibleUsers.map((user) => <AccountItem key={user.id} user={user} />)
            ) : (
                <p>No users found.</p>
            )}

            {shouldShowToggleButton && (
                <p className={cx("more-btn")} onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show less" : "Show all"}
                </p>
            )}
        </div>
    );
}

FollowingAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default FollowingAccounts;
