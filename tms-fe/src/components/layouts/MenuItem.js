import { Link, useParams } from 'react-router-dom';
import Icon from '../icons/icons';

const MenuItem = ({ text, icon, link, isActive, isCollapsed }) => {
    const { testPlanId } = useParams();
    return (
        <Link
            to={link + '/' + testPlanId}
            className={`mb-2 flex items-center gap-4 py-3 pl-3 pr-2 text-[15px] ${
                isActive ? 'bg-white font-bold text-blue-600' : 'text-white'
            }  hover:bg-blue-800`}
        >
            {icon && <Icon name={icon} className={`${isActive ? 'fill-blue-600' : 'fill-white'}`} />}
            <span className={`truncate  ${isCollapsed ? 'hidden' : ''}`}>{text}</span>
        </Link>
    );
};

export default MenuItem;
