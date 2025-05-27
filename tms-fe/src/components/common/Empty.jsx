import NotData from 'assets/images/Search.svg';

/**
 * Empty component displays a "not found" message with an image when there is no data available.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.notFoundMessage - The message to display when no data is found.
 * @returns {JSX.Element} - Rendered Empty component.
 */
const Empty = (props) => {
    const { notFoundMessage, className = 'flex flex-col items-center justify-center gap-y-4' } = props;

    return (
        <div className={className}>
            <img src={NotData} className="m-auto" />
            <div className="text-sm font-normal text-neutral-3">{notFoundMessage}</div>
        </div>
    );
};

export default Empty;
