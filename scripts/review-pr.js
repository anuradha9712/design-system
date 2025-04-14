const axios = require('axios');
const { execSync } = require('child_process');

// Replace with your values
const PR_NUMBER = process.argv[2];
const AZURE_OPENAI_ENDPOINT = 'https://<your-endpoint>.openai.azure.com';
const AZURE_DEPLOYMENT_NAME = '<your-deployment-name>';
const API_VERSION = '2023-05-15';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Get the diff
const repo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner').toString().trim();
const diff = execSync(`gh pr diff ${PR_NUMBER} --repo ${repo} --color=never`).toString();

const prompt = `
You are reviewing the following code diff.
Please point out:
- violations of coding style
- bad practices
- any improvements or edge cases

Diff:
${diff}
`;

async function review() {
  const response = await axios.post(
    `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`,
    {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    {
      headers: {
        'api-key': OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const reviewContent = response.data.choices[0].message.content;

  await axios.post(
    `https://api.github.com/repos/${repo}/issues/${PR_NUMBER}/comments`,
    { body: `🤖 AI Review:\n\n${reviewContent}` },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('✅ Review posted!');
}

review().catch((err) => {
  console.error('❌ Review failed:', err.message);
});
