import { useEffect } from 'react';

function useCloseModalOnOutsideClick(ref, setIsOpen) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, setIsOpen]);
}

export default useCloseModalOnOutsideClick;
