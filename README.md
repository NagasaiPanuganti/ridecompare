# RideCompare

A transportation discovery and comparison platform that enables users to view real-time price and ETA estimates across multiple ride-hailing providers and seamlessly redirect to the chosen provider to complete booking.

## Architecture

```
User → [Next.js Frontend] → [FastAPI Backend] → [Provider Adapters (Uber/Lyft)]
                                    ↓
                          [Aggregator → Ranking → Redirect URLs]
                                    ↓
                          [Sorted Results + Deep Links]
```

**Stateless, request-driven design.** All provider estimates are fetched in parallel, normalized, ranked, and returned within a single request lifecycle. No booking or payment logic exists within the platform.

### Core Components

| Component | Tech | Responsibility |
|-----------|------|----------------|
| Client App | Next.js 16, TypeScript, Tailwind CSS v4 | Location input, category selection, results display |
| API Gateway | FastAPI | Request validation, CORS, error handling |
| Aggregation Service | Python asyncio | Parallel fetch from adapters with timeouts |
| Provider Adapters | Abstract base + mock implementations | Isolated per-provider API integration |
| Ranking Engine | Python | Price-primary, ETA-secondary sort |
| Redirect Generator | Python | Provider-specific deep-link URLs |

## Prerequisites

- **Python 3.9+**
- **Node.js 20+** (via [nvm](https://github.com/nvm-sh/nvm) recommended)
- **Google Maps API Key** (for location autocomplete — optional for development)

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/NagasaiPanuganti/ridecompare.git
cd ridecompare
```

### 2. Start the Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. Test it:

```bash
curl -X POST http://localhost:8000/compare \
  -H "Content-Type: application/json" \
  -d '{"pickup_lat":37.7749,"pickup_lng":-122.4194,"drop_lat":37.3382,"drop_lng":-121.8863,"category":"Standard"}'
```

API docs available at `http://localhost:8000/docs` (Swagger UI).

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. (Optional) Add Google Maps API Key

For location autocomplete, add your key to `frontend/.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Reference

### `POST /compare`

Compare ride estimates across providers.

**Request:**
```json
{
  "pickup_lat": 37.7749,
  "pickup_lng": -122.4194,
  "drop_lat": 37.3382,
  "drop_lng": -121.8863,
  "category": "Standard"
}
```

Categories: `Standard`, `XL`, `Premium`

**Response:**
```json
[
  {
    "provider": "Lyft",
    "normalized_category": "Standard",
    "estimated_price": 18.50,
    "eta_minutes": 4,
    "redirect_url": "https://lyft.com/ride?..."
  },
  {
    "provider": "Uber",
    "normalized_category": "Standard",
    "estimated_price": 21.30,
    "eta_minutes": 6,
    "redirect_url": "https://m.uber.com/ul/?..."
  }
]
```

Results are sorted by price (ascending), with ETA as tiebreaker.

### `GET /health`

Returns `{"status": "ok"}`.

## Running Tests

```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```

All 19 tests cover: adapters, ranking, redirect URLs, and full endpoint integration.

## Project Structure

```
ridecompare/
├── backend/
│   ├── app/
│   │   ├── adapters/        # Provider adapters (Uber/Lyft mocks)
│   │   ├── models/          # Pydantic request/response models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Aggregator, ranking, redirect
│   │   ├── config.py        # Environment config
│   │   └── main.py          # FastAPI app entry
│   ├── tests/               # 19 pytest tests
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/             # Next.js pages
│       ├── components/      # React components
│       ├── hooks/           # useCompare custom hook
│       ├── lib/             # API client, Google Maps loader
│       └── types/           # TypeScript interfaces
└── docs/                    # PRD and Technical PRD
```

## Key Design Decisions

- **Adapters return empty list on failure** — graceful degradation is baked into the adapter contract, not the caller
- **Parallel execution with per-adapter timeouts** — `asyncio.wait_for` wraps each adapter call independently
- **Redirect URLs attached before ranking** — the redirect service needs the original request, ranking only reorders
- **Mock adapters with realistic randomization** — prices vary by distance and category, with simulated latency and 5% failure rate

## MVP Scope

**In scope:** Price/ETA comparison, category normalization, provider redirect
**Out of scope:** Booking, payments, scraping, historical pricing, more than 2 providers

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `CORS_ORIGINS` | Backend `.env` | Allowed frontend origins |
| `ADAPTER_TIMEOUT_SECONDS` | Backend `.env` | Per-adapter timeout (default: 2.5s) |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | Backend URL (default: http://localhost:8000) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Frontend `.env.local` | Google Maps API key |

## License

MIT
