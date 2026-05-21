// Proxy chain for CORS bypass
const PROXY_CHAIN = [
  (url) => `http://localhost:3300/proxy?url=${encodeURIComponent(url)}`,
  (url) => url,
  (url) => `https://corsproxy.io/?${url}`,
];

export async function fetchWithProxy(targetUrl) {
  for (const makeUrl of PROXY_CHAIN) {
    try {
      const proxyUrl = makeUrl(targetUrl);
      const res = await fetch(proxyUrl);
      if (!res.ok) continue;
      const text = await res.text();
      if (!text || text.includes("Free usage is limited") || text.startsWith("<")) continue;
      const json = JSON.parse(text);
      if (json.error) continue;
      return json;
    } catch (e) {
      console.warn("Proxy attempt failed:", e.message);
    }
  }
  throw new Error("Could not fetch data. Make sure the proxy server is running: node server.js");
}

export const getCollectionParams = (str) => {
  if (!str) return null;
  const colMatch = str.match(/collection_id=([^&]+)/);
  const tagsMatch = str.match(/tags=([^&]+)/);
  if (colMatch) {
    return { collectionId: colMatch[1], tags: tagsMatch ? tagsMatch[1] : "" };
  }
  const pathMatch = str.match(/\/collections\/([0-9]+)/);
  if (pathMatch) {
    return { collectionId: pathMatch[1], tags: tagsMatch ? tagsMatch[1] : "" };
  }
  return null;
};
