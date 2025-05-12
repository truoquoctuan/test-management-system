import React from 'react';
import { toast } from 'sonner';
import Icon from '../../icons/Icon';

const ToastCustom = ({ status, title, message, t }) => {
  return (
    <div className={` w-[360px] flex gap-3 p-4 rounded-lg ${status ? 'bg-[#216E4E]' : 'bg-red-500'}`}>
      <Icon name={`${status ? 'Success' : 'Error'}`} />
      <div className="w-[80%]">
        <h1 className="text-white font-semibold text-base">{title}</h1>
        {message !== '' && <p className="text-sm text-white font-normal">{message}</p>}
      </div>
      <div className="absolute right-3">
        <button onClick={() => toast.dismiss(t)}>
          <Icon name="Close2" />
        </button>
      </div>
    </div>
  );
};

export default ToastCustom;
