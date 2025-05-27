/* eslint-disable react/no-unescaped-entities */
import NotData from '../../assets/images/Search.svg';
const NotFound = () => {
    return (
        <div className="flex justify-center">
            <div>
                <img src={NotData} className="m-auto" />
                <p className="text-sm font-normal text-[#787878]">We couldn't find any archived plans.</p>
            </div>
        </div>
    );
};

export default NotFound;
