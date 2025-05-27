import NotData from '../../assets/images/Search.svg';
const NotFound = () => {
    const handleBack = () => {
        history.back();
    };
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div>
                <img src={NotData} className="m-auto" />
            </div>
            <div className="mt-2 text-center">
                <p className="text-xl font-bold">
                    Oops! The page you{"'"}re looking for doesn{"'"}t exist.
                </p>
                <p className="text-base font-normal text-[#787878]">
                    It looks like the page you{"'"}re trying to visit has been moved or <br /> does not exist. Please
                    check the URL and try again.
                </p>
            </div>

            <p
                className="mt-3 cursor-pointer hover:border-b hover:border-blue-500 hover:text-blue-500"
                onClick={() => handleBack()}
            >
                Go back
            </p>
        </div>
    );
};

export default NotFound;
