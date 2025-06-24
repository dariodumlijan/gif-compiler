import { useEffect, useState } from 'react'
import closeIcon from '../assets/icons/close.svg'
import helpIcon from '../assets/icons/help.svg'
import folderTree from '../assets/images/tree.png'
import text from '../locales/default.json'

function Help(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleESC = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleESC)

    return () => {
      document.removeEventListener('keydown', handleESC)
    }
  }, [open])

  const handleToggle = (): void => {
    setOpen(!open)
  }

  return (
    <div className="help-wrapper">
      <img alt="help" className="icon" src={helpIcon} onClick={handleToggle} />

      {open && (
        <div className="modal-wrapper">
          <img alt="close" className="icon" src={closeIcon} onClick={handleToggle} />
          <div className="content-wrapper">
            <h3>{text.help.formats_title}</h3>
            <p>
              {text.help.formats_text_1}
              <b>{text.help.formats_text_2}</b>
            </p>
            <hr />
            <h3>{text.help.folders_title}</h3>
            <div className="split-wrapper">
              <img className="folder-image" src={folderTree} alt="folder_tree" />
              <div className="text-wrapper">
                <p>{text.help.folders_text_1}</p>
                <p>{text.help.folders_text_2}</p>
                <p>{text.help.folders_text_3}</p>
                <p>1. {text.help.folders_text_4}</p>
                <p className="indent">{text.help.folders_text_5}</p>
                <p>2. {text.help.folders_text_6}</p>
                <p className="indent">{text.help.folders_text_7}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Help
