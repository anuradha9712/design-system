import axios from 'axios';
import fs from 'fs';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_FILE_ID = 'w8sqBtJpvq86D06UE7gN0T';
const FIGMA_API_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

async function fetchFigmaPages() {
  try {
    const response = await axios.get(`${FIGMA_API_URL}/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
      },
    });

    const pages = extractPages(response.data.document);
    console.log('Pages:', pages);

    // Write the pages to a file
    fs.writeFileSync('figmaPages.txt', pages.join('\n'));
    console.log('Page names written to figmaPages.txt');
  } catch (error) {
    console.error('Error fetching Figma content:', error);
  }
}

function extractPages(node) {
  const pages = [];
  if (node.type === 'CANVAS') {
    pages.push(node.name);
  }
  if (node.children) {
    for (const child of node.children) {
      pages.push(...extractPages(child));
    }
  }
  return pages;
}

fetchFigmaPages();
