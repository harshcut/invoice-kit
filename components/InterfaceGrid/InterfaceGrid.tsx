import React from 'react';
import { SidePanel } from 'components';

interface Props {
  children: React.ReactNode;
}

const InterfaceGrid = ({ children }: Props): React.ReactElement => {
  return (
    <>
      <div style={{ display: 'flex', background: '#f2f2f2' }}>
        <SidePanel />
        <div
          style={{
            boxSizing: 'border-box',
            flexGrow: 1,
            height: '100vh',
            background: '#f2f2f2',
            padding: 48,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default InterfaceGrid;
