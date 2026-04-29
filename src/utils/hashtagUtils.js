// Extract hashtags from text
export function extractHashtags(text) {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.toLowerCase()) : [];
}

// Clean hashtags (remove # symbol)
export function cleanHashtags(hashtags) {
  return hashtags.map(tag => tag.replace('#', ''));
}

// Count occurrences of each hashtag
export function countHashtags(posts) {
  const counts = {};
  
  posts.forEach(post => {
    const hashtags = extractHashtags(post.content);
    hashtags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  
  return counts;
}

// Get trending hashtags (sorted by count)
export function getTrendingHashtags(posts, limit = 10) {
  const counts = countHashtags(posts);
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Get posts that contain a specific hashtag
export function getPostsByHashtag(posts, hashtag) {
  const cleanTag = hashtag.replace('#', '').toLowerCase();
  return posts.filter(post => {
    const tags = extractHashtags(post.content);
    return tags.some(tag => tag.includes(cleanTag));
  });
}
