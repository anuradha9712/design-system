import * as React from 'react';
import { BaseProps, extractBaseProps } from '@/utils/types';
import { AccentAppearance } from '@/common.type';
// import { OutgoingBubble } from './outgoingBubble';
import { OutgoingBubble } from './outgoingBubble';

export type ChatBubbleType = 'incoming' | 'outgoing';
export interface OutgoingOptionProps {
  children?: React.ReactNode;
  status?: boolean;
  actionBar?: React.ReactNode;
  time?: string | React.ReactText;
  metaData?: string;
  urgentMessage?: React.ReactNode;
  failedMessage?: React.ReactNode;
}

export interface IncomingOptionProps {
  children: React.ReactNode;
  time?: string;
  metaData?: string;
  urgentMessage?: React.ReactNode;
  senderName?: string;
  withAvatar?: boolean;
  avatarOptions?: {
    appearance?: AccentAppearance;
    firstName: string;
    lastName: string;
    className?: string;
    children?: string | React.ReactNode;
  };
}

export interface ChatBubbleProps extends BaseProps {
  type: ChatBubbleType;
  incomingOptions?: IncomingOptionProps;
  outgoingOptions?: OutgoingOptionProps;
}

export const ChatBubble = (props: ChatBubbleProps) => {
  const { type, incomingOptions, outgoingOptions } = props;
  const baseProps = extractBaseProps(props);

  console.log('outgoing option', outgoingOptions);

  if (type === 'outgoing') {
    return (
      <div data-test="DesignSystem-ChatBubble" {...baseProps} className='bg-primary'>
        <OutgoingBubble 
        {...outgoingOptions} 
        />
      </div>
    );
  }

  return <p>hello world</p>;
};

export default ChatBubble;
