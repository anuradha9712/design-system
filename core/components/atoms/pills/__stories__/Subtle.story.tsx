import * as React from 'react';
import Pills from '../Pills';
import Text from '@/components/atoms/text';
import { AccentAppearance } from '@/common.type';

// CSF format story
export const subtle = () => {
  const ButtonSubtle = true;
  const weight = 'strong';

  const appearances: AccentAppearance[] = [
    'primary',
    'secondary',
    'alert',
    'warning',
    'success',
    'accent1',
    'accent2',
    'accent3',
    'accent4',
  ];
  return (
    <div className="d-flex">
      {appearances.map((appear, ind) => {
        return (
          <div key={ind} className="mr-9">
            <Pills appearance={appear} subtle={ButtonSubtle}>
              10
            </Pills>
            <br />
            <Text weight={weight}>{appear.charAt(0).toUpperCase() + appear.slice(1)}</Text>
          </div>
        );
      })}
    </div>
  );
};

export default {
  title: 'Components/Pills/Subtle',
  component: Pills,
  parameters: {
    docs: {
      docPage: {
        title: 'Pills',
        description: 'Pills are used to highlight number of items. For status and text, use a Badge.',
      },
    },
  },
};
