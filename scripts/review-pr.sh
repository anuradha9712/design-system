#!/bin/bash

PR_NUMBER=$1
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
AZURE_OPENAI_ENDPOINT="https://openaipocinref.openai.azure.com"
AZURE_DEPLOYMENT_NAME="gpt-4o"
API_VERSION="2024-10-21"
OPENAI_API_KEY="${OPENAI_API_KEY}"
GITHUB_TOKEN="${GITHUB_TOKEN}"

# === Validate Inputs ===
if [ -z "$PR_NUMBER" ]; then
  echo "❌ Usage: ./review-pr.sh <PR_NUMBER>"
  exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Please set OPENAI_API_KEY and GITHUB_TOKEN environment variables."
  exit 1
fi

# === Get PR Diff ===
echo "📦 Fetching diff for PR #$PR_NUMBER..."
DIFF=$(gh pr diff "$PR_NUMBER" --repo "$REPO" --color=never)

# === Truncate if too long ===
MAX_LENGTH=8000
if [ ${#DIFF} -gt $MAX_LENGTH ]; then
  echo "⚠️ Diff is too long, truncating to ${MAX_LENGTH} characters."
  DIFF="${DIFF:0:$MAX_LENGTH}"
fi

# === Escape and format prompt ===
PROMPT=$(printf '%s\n' "You are an experienced code reviewer. Review the following pull request diff and provide:
- Suggestions for improvements
- Style guide violations
- Code smells or edge cases

PR Diff:
$DIFF")

# Escape for JSON
ESCAPED_PROMPT=$(echo "$PROMPT" | sed 's/\\/\\\\/g; s/"/\\"/g; s/$/\\n/' | tr -d '\n')

# === Create JSON file for Azure API ===
TMP_JSON=$(mktemp)
cat > "$TMP_JSON" <<EOF
{
  "messages": [
    { "role": "user", "content": "$ESCAPED_PROMPT" }
  ],
  "temperature": 0.3,
  "max_tokens": 800
}
EOF

# === Send to Azure OpenAI ===
echo "🧠 Sending prompt to Azure OpenAI..."
RESPONSE=$(curl -s -X POST "$AZURE_OPENAI_ENDPOINT/openai/deployments/$AZURE_DEPLOYMENT_NAME/chat/completions?api-version=$API_VERSION" \
  -H "api-key: $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  --data @"$TMP_JSON")

echo "$RESPONSE" > /tmp/azure-ai-debug.json

rm "$TMP_JSON"

# === Try to extract response content ===
REVIEW_CONTENT=$(echo "$RESPONSE" | sed -n 's/.*"content":"\([^"]*\)".*/\1/p' | sed 's/\\n/\n/g' | sed 's/\\"/"/g')

# === Error Handling ===
if [ -z "$REVIEW_CONTENT" ]; then
  echo "❌ Failed to extract response from Azure OpenAI."
  echo "🪵 Raw response from API:"
  echo "$RESPONSE" | sed 's/\\n/\n/g' | sed 's/\\"/"/g' | fold -s -w 100
  exit 1
fi

echo "$REVIEW_CONTENT" > ./scripts/ai-review-result-"$PR_NUMBER".txt

# === Post Review as Comment on PR ===
echo "💬 Posting review comment to PR..."
POST_RESPONSE=$(curl -s -X POST "https://api.github.com/repos/$REPO/issues/$PR_NUMBER/comments" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"body\": \"🤖 AI Code Review:\n\n$REVIEW_CONTENT\"}")

# === Confirm Success ===
if echo "$POST_RESPONSE" | grep -q '"url":'; then
  echo "✅ Review posted successfully!"
else
  echo "❌ Failed to post review comment."
  echo "🪵 GitHub API response:"
  echo "$POST_RESPONSE"
  exit 1
fi
