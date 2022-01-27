import * as React from 'react';
import Badge from '../Badge';
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
            <Badge appearance={appear} subtle={ButtonSubtle}>
              {'Badge'}
            </Badge>
            <br />
            <Text weight={weight}>{appear.charAt(0).toUpperCase() + appear.slice(1)}</Text>
          </div>
        );
      })}
    </div>
  );
};

export default {
  title: 'Components/Badge/Subtle',
  component: Badge,
  parameters: {
    docs: {
      docPage: {
        title: 'Badge',
      },
    },
  },
};
