# Traffic Proxy

Small local backend that forwards historical traffic requests to Transport for NSW.

## Endpoint

- `POST http://localhost:8787/api/traffic/historicaldata`
- `POST http://localhost:8787/v1/traffic/historicaldata` (compatibility route)
- Health check: `GET http://localhost:8787/health`

## Setup

1. Open a terminal in this folder.
2. Install dependencies:
   - `npm install`
3. Optional: copy `.env.example` to `.env` and set `TRANSPORT_NSW_API_TOKEN`.
4. Start server:
   - `npm start`

## Auth options

You can authenticate in either way:

1. Send header from client:
   - `Authorization: apikey YOUR_TOKEN`
2. Put token in `.env` as `TRANSPORT_NSW_API_TOKEN` and do not send header from client.

## Using with the standalone viewer

In `traffic-historical-viewer.html`, set Optional proxy base URL to:

- `http://localhost:8787`

The viewer will call:

- `http://localhost:8787/v1/traffic/historicaldata`

This proxy already supports that path.
