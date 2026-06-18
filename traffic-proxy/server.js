const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const upstreamUrl = "https://api.transport.nsw.gov.au/v1/traffic/historicaldata";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "traffic-proxy" });
});

async function forwardHistoricalData(req, res) {
  try {
    const clientAuthorization = req.get("authorization");
    const envToken = (process.env.TRANSPORT_NSW_API_TOKEN || "").trim();

    const authorization =
      clientAuthorization ||
      (envToken ? `apikey ${envToken}` : "");

    if (!authorization) {
      return res.status(400).json({
        message:
          "Missing API key. Send Authorization header (apikey TOKEN) or set TRANSPORT_NSW_API_TOKEN in .env"
      });
    }

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, text/csv, application/octet-stream"
      },
      body: JSON.stringify(req.body || {})
    });

    const contentType = upstreamResponse.headers.get("content-type");
    const contentDisposition = upstreamResponse.headers.get("content-disposition");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }
    if (contentDisposition) {
      res.setHeader("Content-Disposition", contentDisposition);
    }

    res.status(upstreamResponse.status);

    const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    res.status(502).json({
      message: "Proxy request failed",
      details: error && error.message ? error.message : String(error)
    });
  }
}

// Primary proxy route
app.post("/api/traffic/historicaldata", forwardHistoricalData);

// Compatibility route for clients that call /v1/traffic/historicaldata on proxy host
app.post("/v1/traffic/historicaldata", forwardHistoricalData);

app.listen(port, () => {
  console.log(`Traffic proxy listening on http://localhost:${port}`);
  console.log("Use POST http://localhost:" + port + "/api/traffic/historicaldata");
});
