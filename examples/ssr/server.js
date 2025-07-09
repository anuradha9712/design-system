import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderServerSideComponents, createClientSideComponent, renderAdvancedSSRExample } from './components.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

// Initialize server
function initializeServer() {
  console.log('🎨 Design System will be loaded client-side only (UMD builds are for browser environments)');

  // SSR function that renders React components on the server
  function renderApp(componentProps = {}) {
    const App = () => {
      return React.createElement('div', { className: 'ssr-app' },
        React.createElement('h1', null, 'Design System SSR Test'),
        React.createElement('p', null, 'This page is server-side rendered using Express'),
        
        // Server-side rendered components
        renderServerSideComponents(),
        
        // Client-side component that will be hydrated
        createClientSideComponent(),
        
        // Advanced SSR example
        renderAdvancedSSRExample(componentProps),
        
        // Design System Components Demo (client-side only)
        React.createElement('div', { className: 'design-system-demo' },
          React.createElement('h3', null, 'Design System Components (Client-Side Only)'),
          React.createElement('p', null, 'Design system components will be loaded and rendered on the client side after hydration.'),
          React.createElement('div', { className: 'component-grid' },
            React.createElement('div', { className: 'component-placeholder' }, 'Button - Will load on client'),
            React.createElement('div', { className: 'component-placeholder' }, 'Card - Will load on client'),
            React.createElement('div', { className: 'component-placeholder' }, 'Icon - Will load on client'),
            React.createElement('div', { className: 'component-placeholder' }, 'Message - Will load on client')
          )
        ),
        
        // Client hydration area
        React.createElement('div', { id: 'client-side-hydration' },
          React.createElement('p', null, 'This content will be hydrated on the client side')
        )
      );
    };

    return ReactDOM.renderToString(React.createElement(App, componentProps));
  }

  // Generate HTML template
  function generateHTML(renderedContent, initialData = {}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design System SSR Test</title>
    
    <!-- Design System CSS -->
    <link rel="stylesheet" href="/index.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Nunito Sans', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .ssr-app {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .component-demo {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
        }
        .server-rendered {
            background-color: #e8f5e8;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .client-hydrated {
            background-color: #e8f4fd;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .server-side-components, .client-side-component, .advanced-ssr-example {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
        .server-data, .design-system-integration {
            margin: 15px 0;
        }
        .server-data ul, .design-system-integration ul {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
        }
        .server-data li, .design-system-integration li {
            margin: 5px 0;
        }
        #client-hydration-area {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #ffeaa7;
        }
        #design-system-test {
            background-color: #d1ecf1;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #bee5eb;
        }
        .status-success {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .status-error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .design-system-demo {
            margin: 30px 0;
            padding: 20px;
            border: 2px solid #007bff;
            border-radius: 6px;
            background-color: #f8f9fa;
        }
        .component-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .server-component {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
        }
        .component-placeholder {
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 4px;
            text-align: center;
            color: #666;
            background-color: #f9f9f9;
        }
        .server-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .client-design-system-demo {
            margin: 30px 0;
            padding: 20px;
            border: 2px solid #28a745;
            border-radius: 6px;
            background-color: #f8fff9;
        }
        .client-component {
            padding: 15px;
            border: 1px solid #28a745;
            border-radius: 4px;
            background-color: #d4edda;
            color: #155724;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="root">${renderedContent}</div>
    
    <!-- React and ReactDOM -->
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    
    <!-- Design System UMD Build -->
    <script src="/index.umd.js"></script>
    
    <!-- Client-side hydration script -->
    <script>
        // Initial data from server
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        
        // Client-side hydration
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Design System UMD Build:', window.InnovaccerDesignSystem);
            
            // Test if the design system is available
            if (window.InnovaccerDesignSystem) {
                console.log('✅ Design System UMD build loaded successfully!');
                
                // Update component status
                const componentStatus = document.getElementById('component-status');
                if (componentStatus) {
                    componentStatus.innerHTML = '<div class="status-success">✅ Design System loaded successfully!</div>';
                }
                
                // Add a visual indicator that client-side hydration is working
                const hydrationDiv = document.getElementById('client-side-hydration');
                if (hydrationDiv) {
                    hydrationDiv.innerHTML += '<div class="client-hydrated">✅ Client-side hydration successful! Design System components are available.</div>';
                }
                
                // Update client hydration area
                const clientHydrationArea = document.getElementById('client-hydration-area');
                if (clientHydrationArea) {
                    clientHydrationArea.innerHTML = '<div class="status-success">✅ Client-side hydration completed! You can now use design system components.</div>';
                }
                
                // Render client-side design system components
                renderClientSideDesignSystemComponents();
                
                // Test component availability
                const availableComponents = ['Button', 'Card', 'Icon', 'Table', 'Message', 'Menu', 'GridCell', 'InlineMessage'];
                const availableComponentsList = availableComponents.map(comp => {
                    const isAvailable = window.InnovaccerDesignSystem[comp] !== undefined;
                    return \`<li>\${comp}: \${isAvailable ? '✅ Available' : '❌ Not Available'}</li>\`;
                }).join('');
                
                const designSystemTest = document.getElementById('design-system-test');
                if (designSystemTest) {
                    designSystemTest.innerHTML = \`
                        <div class="status-success">✅ Design System Components Test</div>
                        <p>Available components:</p>
                        <ul>\${availableComponentsList}</ul>
                    \`;
                }
                
            } else {
                console.error('❌ Design System UMD build not found!');
                const hydrationDiv = document.getElementById('client-side-hydration');
                if (hydrationDiv) {
                    hydrationDiv.innerHTML += '<div class="status-error">❌ Design System UMD build not loaded!</div>';
                }
                
                const componentStatus = document.getElementById('component-status');
                if (componentStatus) {
                    componentStatus.innerHTML = '<div class="status-error">❌ Design System not loaded!</div>';
                }
                
                const clientHydrationArea = document.getElementById('client-hydration-area');
                if (clientHydrationArea) {
                    clientHydrationArea.innerHTML = '<div class="status-error">❌ Client-side hydration failed! Design System not available.</div>';
                }
            }
        });
        
        // Function to render client-side design system components
        function renderClientSideDesignSystemComponents() {
            if (!window.InnovaccerDesignSystem) return;
            
            const { Button, Card, Icon, Message } = window.InnovaccerDesignSystem;
            
            // Create a container for client-side components
            const clientContainer = document.createElement('div');
            clientContainer.className = 'client-design-system-demo';
            clientContainer.innerHTML = \`
                <h3>Client-Side Rendered Design System Components</h3>
                <div class="component-grid">
                    \${Button ? '<div class="client-component">✅ Client Button Component</div>' : '<div class="component-placeholder">Button not available</div>'}
                    \${Card ? '<div class="client-component">✅ Client Card Component</div>' : '<div class="component-placeholder">Card not available</div>'}
                    \${Icon ? '<div class="client-component">✅ Client Icon Component</div>' : '<div class="component-placeholder">Icon not available</div>'}
                    \${Message ? '<div class="client-component">✅ Client Message Component</div>' : '<div class="component-placeholder">Message not available</div>'}
                </div>
            \`;
            
            // Insert after the server components
            const serverDemo = document.querySelector('.design-system-demo');
            if (serverDemo) {
                serverDemo.parentNode.insertBefore(clientContainer, serverDemo.nextSibling);
            }
        }
    </script>
</body>
</html>`;
  }

  // Routes
  app.get('/', (req, res) => {
    const initialData = {
      message: 'Hello from Server-Side Rendering!',
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent')
    };

    const renderedContent = renderApp(initialData);
    const html = generateHTML(renderedContent, initialData);
    
    res.send(html);
  });

  // API endpoint to test design system components
  app.get('/api/test-components', (req, res) => {
    res.json({
      message: 'Design System SSR Test API',
      availableComponents: ['Button', 'Card', 'Icon', 'Table', 'Message', 'Menu', 'GridCell', 'InlineMessage'],
      serverSideAvailable: false,
      clientSideAvailable: true,
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      designSystemLoaded: false,
      note: 'Design system loads client-side only (UMD build)'
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 SSR Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 API test: http://localhost:${PORT}/api/test-components`);
    console.log(`📁 Make sure to run 'npm run build' to copy the design system files to ./public/`);
    console.log(`🎨 Design System: Client-side only (UMD builds are for browser environments)`);
  });
}

// Start the server
initializeServer(); 