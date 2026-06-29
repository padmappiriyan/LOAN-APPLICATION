import React from 'react';
import Button from './Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  icon: Icon, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary' 
}) => {
  if (!isOpen) return null;

  const isDanger = confirmVariant === 'danger';

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 text-center animate-slide-up">
        
        {Icon && (
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl ${
            isDanger ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-700'
          }`}>
            <Icon size={24} />
          </div>
        )}
        
        <h3 className="text-lg font-bold text-brand-600">
          {title}
        </h3>
        
        <p className="text-zinc-500 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </p>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
