import * as React from 'react';
// import { OutgoingOptionProps } from '../ChatBubble';
// import { Popover, Text, Icon } from '@/index';
import { Text, Popover, Icon } from '@/index';

interface OutgoingTriggerProps {
  children?: React.ReactNode;
}

const OutgoingBubbleTrigger = (props: OutgoingTriggerProps) => {
  const { children } = props;
  return <div data-test="DesignSystem-OutgoingBubble">{children}</div>;
};

export const OutgoingBubble = (props: any) => {
  const { children, actionBar, status, time, metaData } = props;

  return (
    <div className="d-flex flex-column">
      <div
        className="d-flex align-items-center justify-content-center"
        data-test="DesignSystem-OutgoingBubble--Metadata"
      >
        {time && <Text>{time}</Text>}
        {metaData && <Text>{metaData}</Text>}
        <Text>bubble bubble</Text>
      </div>

      <div>
        {actionBar ? (
          <Popover position="left" on="hover" trigger={<OutgoingBubbleTrigger>{children}</OutgoingBubbleTrigger>}>
            <>{actionBar}</>
          </Popover>
        ) : (
          <OutgoingBubbleTrigger>{children}</OutgoingBubbleTrigger>
        )}
      </div>

      {status && <Icon appearance="success" name="done" />}
    </div>
  );
};

export default OutgoingBubble;
