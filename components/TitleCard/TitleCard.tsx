import React from 'react';
import { Stack, Text, FontIcon } from '@fluentui/react';

interface Props {
  title?: string;
  description?: string;
  iconName?: string;
  innerPadding?: string | number;
  children?: React.ReactNode;
}

const TitleCard = ({
  title,
  description,
  iconName,
  innerPadding,
  children,
}: Props): React.ReactElement => {
  return (
    <article
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '#0002 0px 1.6px 3.6px 0px, #0000001c 0px 0.3px 0.9px 0px',
        minWidth: 'max-content',
        overflow: 'hidden',
      }}
    >
      <Stack horizontal style={{ padding: '0 24px', gap: '24px' }}>
        <FontIcon
          iconName={iconName}
          style={{ fontSize: 22, color: '#0078d4', lineHeight: '56px', userSelect: 'none' }}
        />
        <Stack verticalAlign="center" style={{ height: '56px' }}>
          <Text style={{ fontWeight: 600, fontSize: '14px' }}>{title}</Text>
          <Text style={{ fontWeight: 400, fontSize: '12px', color: '#605e5c' }}>{description}</Text>
        </Stack>
      </Stack>
      {children && (
        <div style={{ borderTop: '1px solid #e8e8e8', padding: innerPadding ?? '24px 24px 30px' }}>
          {children}
        </div>
      )}
    </article>
  );
};

export default TitleCard;
