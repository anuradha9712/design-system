# Design System SSR Test

This example demonstrates how to test your design system UMD build in a Server-Side Rendering (SSR) environment using Node.js and Express.

## Overview

This SSR setup allows you to:
- Test your design system UMD build in a server-side rendering environment
- Verify that components work correctly after client-side hydration
- Test the integration between server-rendered content and client-side JavaScript
- Validate that your design system works in both SSR and CSR contexts

## Requirements

- **Node.js**: >= 20.0.0
- **React**: 16.14.0
- **ReactDOM**: 16.14.0

## Setup Instructions

### 1. Install Dependencies

```bash
cd examples/ssr
npm install
```

### 2. Build and Copy Design System Files

```bash
npm run build
```

This command copies the design system UMD build and CSS files to the `public` directory:
- `../../dist/index.umd.js` → `./public/index.umd.js`
- `../../dist/index.umd.css` → `./public/index.css`
- `../../dist/cjs/index.js` → `./public/design-system-cjs.js`

### 3. Start the SSR Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:3000`

## How It Works

### Server-Side Rendering
1. The Express server renders React components on the server using `renderToString`
2. Initial HTML is generated with server-side data
3. The page is sent to the client with pre-rendered content

### Client-Side Hydration
1. React and ReactDOM are loaded from CDN
2. Your design system UMD build is loaded
3. Client-side JavaScript hydrates the server-rendered content
4. Design system components become available for interactive use

### Testing Features

The SSR example includes several testing features:

#### 1. Server-Side Rendering Test
- Shows content that was rendered on the server
- Displays server data (timestamp, user agent, etc.)
- Demonstrates SSR capabilities

#### 2. Client-Side Hydration Test
- Tests if the design system UMD build loads correctly
- Verifies component availability
- Shows hydration status

#### 3. Component Availability Test
- Lists all available design system components
- Shows which components are successfully loaded
- Provides visual feedback for component status

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and environment information.

### Component Test API
```
GET /api/test-components
```
Returns list of available design system components.

## Design System Integration

The example tests the following design system components:
- Button
- Card
- Icon
- Table
- Message
- Menu
- GridCell
- InlineMessage

## Troubleshooting

### Design System Not Loading
1. Ensure you've run `npm run build` to copy the UMD files
2. Check that `./public/index.umd.js` exists
3. Verify the UMD build is accessible at `/index.umd.js`

### Server Errors
1. Check that all dependencies are installed
2. Ensure Node.js version is compatible (>=20.15.0)
3. Verify the port 3000 is available

### Client-Side Issues
1. Check browser console for JavaScript errors
2. Verify that React and ReactDOM are loading correctly
3. Ensure the design system UMD build is accessible

## Customization

### Adding More Components
To test additional design system components:

1. Update the `availableComponents` array in `server.js`
2. Add component tests in the client-side hydration script
3. Update the API endpoint to include new components

### Modifying Server Data
To pass different data to the client:

1. Modify the `initialData` object in the route handler
2. Update the `renderAdvancedSSRExample` function to use new data
3. Adjust the client-side script to handle new data

### Styling
The example includes basic styling in the HTML template. You can:
1. Modify the `<style>` section in `server.js`
2. Add external CSS files
3. Use the design system's CSS classes

## Development

### File Structure
```
examples/ssr/
├── server.js          # Express server with SSR
├── components.js      # React component functions
├── package.json       # Dependencies and scripts
├── public/           # Static files (UMD build, CSS)
└── README.md         # This file
```

### Key Files
- `server.js`: Main Express server with SSR logic
- `components.js`: React component rendering functions
- `public/`: Directory for design system UMD build and CSS

## Testing Checklist

- [ ] Server starts without errors
- [ ] Page loads with server-rendered content
- [ ] Design system UMD build loads in browser
- [ ] Client-side hydration works
- [ ] All design system components are available
- [ ] Console shows no JavaScript errors
- [ ] API endpoints return correct data

## Next Steps

After verifying the SSR setup works:
1. Test with your actual design system components
2. Add more complex component interactions
3. Implement real-world SSR scenarios
4. Test performance and optimization 