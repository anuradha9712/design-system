import axios from 'axios';
import fs from 'fs';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_FILE_ID = 'w8sqBtJpvq86D06UE7gN0T';
const PAGE_NAME = 'Avatar';
const FRAME_ID = '57956:62210';
const FIGMA_API_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

async function fetchFigmaContent() {
  try {
    const response = await axios.get(`${FIGMA_API_URL}/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
      },
    });

    const page = findPage(response.data.document, PAGE_NAME);
    if (page) {
      console.log(`Page "${PAGE_NAME}" found:`, page);
      const frame = findFrame(page, FRAME_ID);
      if (frame) {
        const mdxContent = formatToMDX(frame);
        fs.writeFileSync('output.mdx', mdxContent);
        console.log('MDX file created successfully.');
      } else {
        console.log('Frame not found.');
      }
    } else {
      console.log('Page not found.');
    }
  } catch (error) {
    console.error('Error fetching Figma content:', error);
  }
}

function findPage(node, pageName) {
  if (node.name === pageName && node.type === 'CANVAS') {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findPage(child, pageName);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findFrame(node, frameId) {
  if (node.id === frameId) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findFrame(child, frameId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// function formatToMDX(frame) {
//   let mdxContent = `---\ntitle: ${frame.name}\n---\n\n`;
//   console.log('frame.children>>> ', frame.children[0].children);
//   frame.children.forEach((child) => {
//     if (child.type === 'TEXT') {
//       mdxContent += `${child.characters}\n\n`;
//     }
//   });
//   return mdxContent;
// }

function formatToMDX(frame) {
  let mdxContent = `---\ntitle: ${frame.name}\n---\n\n`;

  function traverseChildren(node) {
    if (node.type === 'TEXT') {
      mdxContent += `${node.characters}\n\n`;
    }
    if (node.children) {
      node.children.forEach(traverseChildren);
    }
  }

  traverseChildren(frame);
  return mdxContent;
}

fetchFigmaContent();
