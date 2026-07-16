import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, title, children, wide }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`admin-modal ${wide ? 'admin-modal--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal__header">
          <h2>{title}</h2>
          <button className="admin-modal__close" type="button" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="admin-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
