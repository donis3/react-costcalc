import React from 'react';
import ResponsiveModal from '../common/ResponsiveModal';

export default function ThemeSelect({isOpen = false, setIsOpen}) {
	
    

    if(!isOpen) {
        return <></>
    }

    return (
        <ResponsiveModal title="Test" handleCloseBtn={() => setIsOpen(false)} >
            content
        </ResponsiveModal>
    );
}
