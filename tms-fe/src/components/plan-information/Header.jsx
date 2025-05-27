const Header = (props) => {
    const { className, header, sub } = props;

    return (
        <div className={className}>
            <p className="text-lg font-bold text-neutral-1">{header}</p>
            <p className="text-sm font-normal text-neutral-3">{sub}</p>
        </div>
    );
};

export default Header;
