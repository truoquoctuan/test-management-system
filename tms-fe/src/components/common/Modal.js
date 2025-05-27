import 'animate.css';
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        padding: '24px 0',
        backgroundColor: 'rgba(105, 105, 105, 0.5)',
        zIndex: 999,
        overflowY: 'auto',
        maxWidth: '100vw',
        maxHeight: '100vh'
    },
    content: {
        position: 'relative',
        top: '5%',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        padding: '0',
        borderRadius: '0px',
        boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#fff',
        overflow: 'auto',
        transform: 'none'
    }
};

const ModalComponent = ({
    isOpen,
    setIsOpen,
    children,
    style,
    className,
    reset,
    isClosing,
    setIsClosing,
    chooseOut
}) => {
    // eslint-disable-next-line no-unused-vars
    const closePopup = () => {
        if (reset) {
            reset({});
        }
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div className={className}>
            <Modal
                isOpen={isOpen}
                onRequestClose={chooseOut ? closePopup : ''}
                style={style ? style : customStyles}
                contentLabel="Popup"
                ariaHideApp={false}
                className={`focus:outline-none ${
                    isClosing ? 'animate__animated animate__zoomOut' : 'animate__animated animate__zoomIn'
                }`}
            >
                {children && <div>{children}</div>}
            </Modal>
        </div>
    );
};

export default ModalComponent;
