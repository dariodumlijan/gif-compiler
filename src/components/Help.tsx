import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { ReactComponent as HelpIcon } from '../assets/icons/help.svg';
import folderTree from '../assets/images/folder_tree.png';

function Help() {
  const { t } = useTranslation();
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
          <div className="content-wrapper">
            <h3>{t('help.formats_title')}</h3>
            <p>
              {t('help.formats_text_1')}
              <b>{t('help.formats_text_2')}</b>
            </p>
            <hr />
            <h3>{t('help.folders_title')}</h3>
            <div className="split-wrapper">
              <img className="folder-image" src={folderTree} alt="folder_tree" />
              <div className="text-wrapper">
                <p>{t('help.folders_text_1')}</p>
                <p>{t('help.folders_text_2')}</p>
                <p>{t('help.folders_text_3')}</p>
                <p>1. {t('help.folders_text_4')}</p>
                <p className="indent">{t('help.folders_text_5')}</p>
                <p>2. {t('help.folders_text_6')}</p>
                <p className="indent">{t('help.folders_text_7')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Help;
