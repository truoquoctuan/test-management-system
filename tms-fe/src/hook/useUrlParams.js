import { useLocation } from 'react-router-dom';

/**
 * Custom hook to get URL parameters using useLocation.
 *
 * @returns {URLSearchParams} The URLSearchParams object representing the URL parameters.
 */
const useUrlParams = () => {
    const location = useLocation();
    return new URLSearchParams(location.search);
};

export default useUrlParams;
