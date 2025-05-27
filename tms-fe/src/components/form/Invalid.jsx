import Icon from 'components/icons/icons';

const Invalid = ({
    isInvalid,
    message,
    classDefault = 'flex items-center gap-x-1 text-sm font-normal text-state-error',
    iconClassName = 'h-3 w-3 fill-state-error',
    className = ''
}) => {
    if (isInvalid) {
        return (
            <div className={`${classDefault} ${className}`}>
                <Icon name="info_circle" className={iconClassName} />

                <div>{message}</div>
            </div>
        );
    }
};

export default Invalid;
