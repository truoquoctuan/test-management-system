import Icon from 'components/icons/icons';

const BtnView = (props) => {
    const {
        view,
        setView,
        className = 'flex h-8 w-8 cursor-pointer items-center justify-center border p-2 transition-all duration-300',
        iconName,
        iconClassName = 'h-6 w-6'
    } = props;

    return (
        <div className={`${className} ${view === 'list' ? 'bg-primary-2' : ''}`} onClick={() => setView('list')}>
            <Icon name={iconName} className={`${iconClassName}  ${view === 'list' ? 'fill-primary-1' : ''} `} />
        </div>
    );
};

export default BtnView;
