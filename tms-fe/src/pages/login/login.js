import Icon from 'components/icons/icons';
import keycloak from 'service/keycloak/Keycloak';
import ImageLogin from '../../assets/images/ImageLogin.svg';
import Line1 from '../../assets/images/Line1.svg';
import Line2 from '../../assets/images/Line2.svg';

const Login = () => {
    const handleLogin = async () => {
        try {
            // eslint-disable-next-line no-undef
            // keycloak.login({ redirectUri: `https://dev-bzq.bzcom.vn/` });
            keycloak.login({ redirectUri: `http://localhost:5893` });
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className=" h-[100vh] w-[100vw]  ">
            <div className=" flex ">
                <div className="h-[100vh] w-[45%] pl-12">
                    <div className="flex items-center  gap-3 py-4 ">
                        <Icon name="logoBZQ" />
                        <p className="text-xl font-bold text-[#0066CC]">Quality Asurance</p>
                    </div>
                    <div className="flex h-[80%] w-[615px] items-center ">
                        <div className="flex flex-col gap-6">
                            <div>
                                <Icon name="folderLogin" />
                            </div>
                            <div>
                                <p className="text-[36px] font-bold text-[#172B4D]">Welcome to TMS!</p>
                                <p className="text-lg font-normal text-[#44546F]">
                                    Effortlessly optimize your testing process, enhance quality with powerful tools, and
                                    streamline collaboration.
                                </p>
                            </div>
                            <div>
                                <button
                                    className="flex gap-2 rounded-lg bg-[#0C66E4] px-8 py-2.5 text-white"
                                    onClick={() => handleLogin()}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12.102 0L0.61084 8.35821L12.102 16.8159L23.5006 8.39801L12.102 0ZM12.0835 12.6169L6.36566 8.39801L12.0835 4.23881L17.7458 8.43781L12.0835 12.6169Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M4.12645 12.8955L0 15.9801L10.751 24V19.1841L6.36546 16.1393L7.21665 15.3433L4.12645 12.8955Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M19.8735 12.8955L24 15.9801L13.249 24V19.1841L17.6345 16.1393L16.7833 15.3433L19.8735 12.8955Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span className="text-lg font-semibold">Sign in with Keycloak</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative w-[55%] bg-[#0055CC]">
                    <div className="">
                        <div className=" relative">
                            <img src={Line1} alt="" className="h-[100vh]" />
                            <div className=" absolute left-52 top-0">
                                <img src={Line2} alt="" className="h-[100vh] " />
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-2 top-0 flex h-full items-center">
                        <img src={ImageLogin} alt="LineLogin" className="h-[80vh] w-[100vw] " />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
