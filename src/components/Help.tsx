import React, { useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { ReactComponent as HelpIcon } from '../assets/icons/help.svg';

function Help() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleESC = (event: any) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleESC);

    return () => {
      document.removeEventListener('keydown', handleESC);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="help-wrapper">
      <HelpIcon className="icon" onClick={handleToggle} />

      {open && (
        <div className="modal-wrapper">
          <CloseIcon className="icon" onClick={handleToggle} />
        </div>
      )}
    </div>
  );
}

export default Help;
