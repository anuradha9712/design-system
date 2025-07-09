import React from 'react';

// Server-side component rendering functions
export function renderServerSideComponents() {
  return React.createElement('div', { className: 'server-side-components' },
    React.createElement('h2', null, 'Server-Side Rendered Components'),
    React.createElement('div', { className: 'server-rendered' },
      React.createElement('p', null, '✅ This content was rendered on the server'),
      React.createElement('p', null, '📅 Timestamp: ' + new Date().toLocaleString()),
      React.createElement('p', null, '🖥️ Environment: Server-Side Rendering')
    ),
    React.createElement('div', { className: 'component-demo' },
      React.createElement('h3', null, 'Design System Integration Test'),
      React.createElement('p', null, 'The design system UMD build will be loaded on the client side.'),
      React.createElement('p', null, 'Check the browser console to see if the design system is available.')
    )
  );
}

// Client-side component that will be hydrated
export function createClientSideComponent() {
  return React.createElement('div', { className: 'client-side-component' },
    React.createElement('h3', null, 'Client-Side Hydration Test'),
    React.createElement('div', { id: 'design-system-test' },
      React.createElement('p', null, 'This area will be updated after client-side hydration'),
      React.createElement('div', { id: 'component-status' }, 'Loading design system...')
    )
  );
}

// Advanced SSR example with design system components
export function renderAdvancedSSRExample(data = {}) {
  return React.createElement('div', { className: 'advanced-ssr-example' },
    React.createElement('h2', null, 'Advanced SSR with Design System'),
    React.createElement('div', { className: 'server-data' },
      React.createElement('h3', null, 'Server Data:'),
      React.createElement('ul', null,
        React.createElement('li', null, 'Message: ' + (data.message || 'No message')),
        React.createElement('li', null, 'Timestamp: ' + (data.timestamp || 'No timestamp')),
        React.createElement('li', null, 'User Agent: ' + (data.userAgent || 'Unknown'))
      )
    ),
    React.createElement('div', { className: 'design-system-integration' },
      React.createElement('h3', null, 'Design System Integration'),
      React.createElement('p', null, 'The following components will be available after client-side hydration:'),
      React.createElement('ul', null,
        React.createElement('li', null, 'Button - Interactive buttons'),
        React.createElement('li', null, 'Card - Content containers'),
        React.createElement('li', null, 'Icon - Visual icons'),
        React.createElement('li', null, 'Table - Data tables'),
        React.createElement('li', null, 'Message - Status messages'),
        React.createElement('li', null, 'Menu - Navigation menus'),
        React.createElement('li', null, 'GridCell - Layout components'),
        React.createElement('li', null, 'InlineMessage - Inline notifications')
      )
    ),
    React.createElement('div', { id: 'client-hydration-area' },
      React.createElement('p', null, 'Client-side hydration area - will be updated after page load')
    )
  );
} 