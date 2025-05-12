import React from 'react';
import Icon from '../../icons/Icon';

const ErrorForm = ({ error }) => {
  return (
    <div className="flex gap-2">
      <Icon name="InfoCircle" />
      <span className="text-[#AE2E24] text-xs">{error}</span>
    </div>
  );
};

export default ErrorForm;
