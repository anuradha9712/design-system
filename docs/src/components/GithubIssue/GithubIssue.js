import React from 'react';
import { Link, Icon } from '@innovaccer/design-system';

const GithubIssue = () => {

  const getUrl = () => {
    const hostUrl = 'https://github.com/innovaccer/design-system/issues/new'
    const label = '';
    const template = '';
    const url = 'bug_report.md';
      'https://github.com/innovaccer/design-system/issues/new?labels=type%3A+bug&template=bug_report.md';
  }

  return (
    <div className="d-flex align-items-center">
      <Link className='mr-4'>Raise an issue</Link>
      <Icon size={16} name="open_in_new"></Icon>
    </div>
  );
}

export default GithubIssue;