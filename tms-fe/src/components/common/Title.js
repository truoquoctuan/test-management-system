const Title = ({ name, subtitle, className }) => {
    return (
        <div className={className}>
            <p className="text-2xl font-bold text-primary-1">{name}</p>
            <p className="text-sm font-normal text-neutral-3">{subtitle}</p>
        </div>
    );
};

export default Title;
