import Modal from 'react-modal';

/**
 * @typedef {Object} CustomStyles
 * @property {Object} overlay Styles for the overlay.
 * @property {string} overlay.display Display property for the overlay.
 * @property {string} overlay.justifyContent Justify content property for the overlay.
 * @property {string} overlay.alignItems Align items property for the overlay.
 * @property {string} overlay.padding Padding property for the overlay.
 * @property {string} overlay.backgroundColor Background color property for the overlay.
 * @property {number} overlay.zIndex Z-index property for the overlay.
 * @property {string} overlay.overflowY Overflow Y property for the overlay.
 * @property {string} overlay.maxWidth Max width property for the overlay.
 * @property {string} overlay.maxHeight Max height property for the overlay.
 * @property {string} overlay.outlineStyle Outline style property for the overlay.
 * @property {Object} content Styles for the content.
 * @property {string} content.maxWidth Max width property for the content.
 * @property {string} content.padding Padding property for the content.
 * @property {string} content.borderRadius Border radius property for the content.
 * @property {string} content.boxShadow Box shadow property for the content.
 * @property {string} content.backgroundColor Background color property for the content.
 * @property {string} content.overflow Overflow property for the content.
 * @property {string} content.transform Transform property for the content.
 * @property {string} content.outlineStyle Outline style property for the content.
 */
const customStyles = {
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        padding: '24px 0',
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        zIndex: 999,
        overflowY: 'auto',
        maxWidth: '100vw',
        maxHeight: '100vh',
        outlineStyle: 'none'
    },
    content: {
        maxWidth: '95vw',
        padding: '0',
        borderRadius: '0',
        boxShadow: '0px 0px 7px 0px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        transform: 'none',
        outlineStyle: 'none'
    }
};

/**
 * @typedef {Object} PopupProps
 * @property {boolean} isOpen Flag indicating if the popup is open.
 * @property {boolean} animate CSS animation class name.
 * @property {function} handleClose Function to handle close event.
 * @property {string} className Additional CSS classes for the popup.
 * @property {Object} style Custom styles object for the popup.
 * @property {React.ReactNode} children Child components to render within the popup.
 */

/**
 * Popup component using react-modal for displaying modal dialogs.
 * @param {PopupProps} props - Props object for configuring the Popup component.
 * @returns {JSX.Element} Rendered JSX element for the Popup component.
 */
const Popup = (props) => {
    const { isOpen, animate, handleClose, className, style, children } = props;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={style ? style : customStyles}
            contentLabel="Popup"
            ariaHideApp={false}
            className={`animate__animated animate__faster ${className} ${animate}`}
        >
            {children && <>{children}</>}
        </Modal>
    );
};

export default Popup;
