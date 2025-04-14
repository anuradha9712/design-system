#!/bin/bash

# Usage: ./review-pr.sh <PR_NUMBER>

set -e

# Required ENV vars:
# - GITHUB_TOKEN
# - OPENAI_API_KEY
# - AZURE_OPENAI_ENDPOINT (e.g. https://myorg.openai.azure.com)
# - AZURE_DEPLOYMENT_NAME

PR_NUMBER=$1
MAX_DIFF_LENGTH=8000
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
AZURE_OPENAI_ENDPOINT="https://openaipocinref.openai.azure.com"
AZURE_DEPLOYMENT_NAME="gpt-4o"
AZURE_API_VERSION="2024-10-21"

if [ -z "$PR_NUMBER" ]; then
  echo "❌ Please provide a PR number."
  exit 1
fi

echo "📦 Fetching diff for PR #$PR_NUMBER..."

DIFF=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/pulls/$PR_NUMBER" | \
  grep '"diff_url":' | cut -d '"' -f4 | xargs curl -s)

if [ -z "$DIFF" ]; then
  echo "❌ Failed to fetch diff."
  exit 1
fi

# Truncate diff if too long
if [ ${#DIFF} -gt $MAX_DIFF_LENGTH ]; then
  echo "⚠️ Diff is too long, truncating to $MAX_DIFF_LENGTH characters."
  DIFF="${DIFF:0:$MAX_DIFF_LENGTH}"
fi

# Prompt
PROMPT=$(cat <<EOF
You are a code reviewer. Review the following GitHub Pull Request diff and provide feedback.
Only comment on issues related to code quality, style, or potential bugs.

GitHub Diff:
$DIFF
EOF
)

echo "🧠 Sending prompt to Azure OpenAI..."

RESPONSE=$(curl -s -X POST "$AZURE_OPENAI_ENDPOINT/openai/deployments/$AZURE_DEPLOYMENT_NAME/chat/completions?api-version=$AZURE_API_VERSION" \
  -H "api-key: $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "messages": [
    { "role": "system", "content": "You are a senior software engineer and code reviewer." },
    { "role": "user", "content": "$(printf "%s" "$PROMPT" | sed 's/"/\\"/g')" }
  ],
  "temperature": 0.3,
  "max_tokens": 800
}
EOF
)

# Check for Azure error
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | cut -d':' -f2- | sed 's/"//g')
  echo "❌ Azure OpenAI Error: $ERROR_MSG"
  exit 1
fi

# Extract content
REVIEW_CONTENT=$(echo "$RESPONSE" | grep -o '"content":"[^"]*"' | head -n1 | cut -d':' -f2- | sed 's/\\n/\n/g; s/\\"/"/g; s/^"//; s/"$//')

if [ -z "$REVIEW_CONTENT" ]; then
  echo "❌ Failed to extract response from Azure OpenAI."
  echo "🪵 Raw response from API:"
  echo "$RESPONSE"
  exit 1
fi

echo "💬 Posting review comment to PR..."

# Escape for JSON
ESCAPED_BODY=$(printf '%s\n' "$REVIEW_CONTENT" | sed 's/\\/\\\\/g; s/"/\\"/g; s/$/\\n/' | tr -d '\n')

POST_RESPONSE=$(curl -s -X POST "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/comments" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"body\": \"🤖 AI Code Review:\\n\\n$ESCAPED_BODY\"}")

if echo "$POST_RESPONSE" | grep -q '"message":"Problems parsing JSON"'; then
  echo "❌ Failed to post review comment."
  echo "🪵 GitHub API response:"
  echo "$POST_RESPONSE"
  exit 1
fi

echo "✅ Review posted successfully."
