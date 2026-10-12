```javascript
function getKeywords(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((word) => word.length > 1);
}

export function findMatchingHelp(request, allRequests) {
  const requestText = [
    request.title,
    request.description,
    request.subject,
    request.skills
  ]
    .filter(Boolean)
    .join(" ");

  const keywords = [...new Set(getKeywords(requestText))];

  return allRequests
    .filter((item) => item.id !== request.id)
    .map((item) => {
      const otherText = [
        item.title,
        item.description,
        item.subject,
        item.skills
      ]
        .filter(Boolean)
        .join(" ");

      const otherKeywords = new Set(getKeywords(otherText));

      const matches = keywords.filter((word) =>
        otherKeywords.has(word)
      );

      return {
        ...item,
        matchScore: matches.length
      };
    })
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
```