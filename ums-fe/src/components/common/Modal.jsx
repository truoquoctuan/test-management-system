// import 'animate.css';
import Modal from 'react-modal';

export const customStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(105, 105, 105, 0.5)',
    zIndex: 999,
    boxSizing: 'border-box',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '100vw',
    maxHeight: '100vh',
    padding: '0',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    overflow: 'auto',
    transform: 'none',
  },
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
  chooseOut,
}) => {
  // eslint-disable-next-line no-unused-vars
  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <Modal
        isOpen={isOpen}
        onRequestClose={closePopup}
        style={style ? style : customStyles}
        contentLabel="Popup"
        ariaHideApp={false}
        // className={`focus:outline-none ${
        //     isClosing ? 'animate__animated animate__zoomOut' : 'animate__animated animate__zoomIn'
        // }`}
        className="rounded-xl focus:outline-none"
      >
        {children && <div>{children}</div>}
      </Modal>
    </div>
  );
};

export default ModalComponent;
