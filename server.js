const http = require("http");
const https = require("https");
const url = require("url");

const PORT = 3300;

function makeRequest(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "Referer": "https://www.swiggy.com/",
        "Origin": "https://www.swiggy.com",
      }
    };

    https.get(options, (proxyRes) => {
      let data = "";
      proxyRes.on("data", chunk => data += chunk);
      proxyRes.on("end", () => {
        resolve({ status: proxyRes.statusCode, data });
      });
    }).on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

  const parsed = url.parse(req.url, true);
  const targetUrl = parsed.query.url;

  if (!targetUrl) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing ?url= parameter" }));
    return;
  }

  console.log(`[PROXY] ${targetUrl.substring(0, 120)}`);

  try {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const result = await makeRequest(targetUrl);
      
      if (result.data && result.data.trim().length > 2 && result.status === 200) {
        console.log(`  [OK] attempt ${attempt}, ${result.data.length} bytes`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(result.data);
        return;
      }
      
      console.log(`  [RETRY] attempt ${attempt}, status=${result.status}, len=${result.data.length}`);
      await new Promise(r => setTimeout(r, 500));
    }

    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Swiggy API failed after 3 retries" }));
  } catch (err) {
    console.error("[PROXY ERROR]", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => console.log(`\n🚀 CORS Proxy running at http://localhost:${PORT}\n`));
