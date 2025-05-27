import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook to update a URL parameter and navigate to the new URL.
 *
 * @returns {function} A function to update the URL parameter.
 */
const useUpdateUrlParam = () => {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Updates a URL parameter and navigates to the new URL.
     *
     * @param {Object} paramValue - An object containing the parameter to update and its new value.
     * @param {string} paramValue.param - The name of the URL parameter to update.
     * @param {string} paramValue.value - The new value for the URL parameter.
     */
    const updateUrlParam = ({ param, value }) => {
        const urlParams = new URLSearchParams(location.search);

        urlParams.set(param, value);

        const newUrl = `${location.pathname}?${urlParams.toString()}`;

        navigate(newUrl);
    };

    return updateUrlParam;
};

export default useUpdateUrlParam;
