// DownloadButton.tsx
import React from 'react';

interface DownloadButtonProps {
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button style={{height:50,width:200}} onClick={onDownload}>Download</button>
    </div>
  );
};

export default DownloadButton;
