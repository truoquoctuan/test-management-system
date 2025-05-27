/**
 * Button component.
 *
 * @param {Object} props - The properties of the Button component.
 * @param {string} [props.type='button'] - The type of the button (e.g., 'button', 'submit').
 * @param {boolean} [props.defaultStyle=true] - Whether to apply default styling to the button.
 * @param {ReactNode} [props.icon] - The icon element to be displayed inside the button.
 * @param {ReactNode} [props.children] - The content to be displayed inside the button.
 * @param {function} [props.onClick] - The function to be called when the button is clicked.
 * @param {string} [props.className] - Additional CSS classes to be applied to the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @returns {ReactNode} The rendered Button component.
 */
const Button = (props) => {
    const {
        type = 'button',
        defaultClass = 'flex items-center justify-center gap-x-2',
        icon,
        children,
        onClick,
        className = '',
        disabled = false
    } = props;
    const buttonClass = `${defaultClass} ${className}`;

    return (
        <button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
            {icon && <>{icon}</>}
            {children && <>{children}</>}
        </button>
    );
};

export default Button;
