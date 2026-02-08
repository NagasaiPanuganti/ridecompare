# RideCompare – Build Plan

This plan is derived from the **RideCompare PRD** and **RideCompare Technical PRD**. It breaks the product into phases and actionable tasks for implementation.

---

## 1. Product Summary

| Item | Description |
|------|-------------|
| **Product** | RideCompare – transportation discovery and comparison platform |
| **Core value** | Real-time price & ETA comparison across providers; redirect to chosen provider to complete booking |
| **MVP scope** | Single comparison endpoint, **two** provider adapters, price-based ranking, redirect-only (no booking/payment in-app) |

---

## 2. Architecture (from Technical PRD)

- **Style:** Stateless, request-driven. Fetch from providers in parallel → normalize → rank → return in one request.
- **Components:**
  1. **Client Application** (Web / Mobile)
  2. **API Gateway**
  3. **Estimate Aggregation Service**
  4. **Provider Adapter Layer**
  5. **Comparison & Ranking Engine**
  6. **Redirect & Deep-Link Generator**

- **Data:** No historical pricing. Estimates live only in memory per request. Optional persistent user preferences only.
- **Boundary:** Adapters are isolated; one provider’s changes don’t affect others or core logic.

---

## 3. API Contract (MVP)

**Endpoint:** `POST /compare`

**Request:**
```json
{
  "pickup_lat": number,
  "pickup_lng": number,
  "drop_lat": number,
  "drop_lng": number,
  "category": string
}
```

**Response:**
```json
[
  {
    "provider": string,
    "normalized_category": string,
    "estimated_price": number,
    "eta_minutes": number,
    "redirect_url": string
  }
]
```

---

## 4. Task Plan by Phase

### Phase 1 – Foundation & API Shell

| # | Task | Notes |
|---|------|------|
| 1.1 | **Project setup** | Repo, language/framework (e.g. Node/Go/Python), env config, basic CI |
| 1.2 | **API Gateway / routing** | Expose `POST /compare`, request validation, error handling |
| 1.3 | **Estimate Aggregation Service** | Orchestrator: accept request → call adapters in parallel → pass to ranking → return response |
| 1.4 | **Shared types & contracts** | Normalized estimate schema, category enum (e.g. Standard, XL, Premium) |
| 1.5 | **Provider adapter interface** | Abstract adapter: `getEstimates(pickup, drop, category) → normalized estimates` |

**Exit criteria:** `POST /compare` exists; can return mock or empty list; p95 latency and structure ready for real adapters.

---

### Phase 2 – Provider Integrations (MVP: 2 providers)

| # | Task | Notes |
|---|------|------|
| 2.1 | **Provider 1 adapter** | Implement adapter for first provider (e.g. Uber or Lyft) using **official API** only |
| 2.2 | **Provider 2 adapter** | Second provider (e.g. Lyft or Uber); same interface, isolated implementation |
| 2.3 | **Auth & config** | No storage of provider credentials in code; use env/secrets; adapters handle tokens/keys |
| 2.4 | **Resilience** | Per-adapter: timeouts, retries, rate limiting; **graceful degradation** if one provider fails |
| 2.5 | **Schema translation** | Map each provider’s response → normalized schema (price, ETA, category) |

**Exit criteria:** Both adapters return real estimates; aggregation service merges results; failures don’t break the whole request.

---

### Phase 3 – Comparison & Ranking

| # | Task | Notes |
|---|------|------|
| 3.1 | **Comparison & Ranking Engine** | Input: list of normalized estimates. Output: sorted list (price primary, ETA secondary) |
| 3.2 | **Category normalization** | Map provider-specific categories to Standard / XL / Premium (or agreed enum) |
| 3.3 | **Redirect URL generator** | Per provider: build deep-link or web URL with prefilled pickup, drop, category (per provider ToS) |
| 3.4 | **Attach redirect_url** | Each ranked result includes correct `redirect_url` for that provider |

**Exit criteria:** Results are ranked; each result has a valid `redirect_url`; categories are normalized in response.

---

### Phase 4 – Client Application (Web)

| # | Task | Notes |
|---|------|------|
| 4.1 | **FR-1: Location autocomplete** | Integrate Maps API (e.g. Google/Mapbox) for pickup and drop-off autocomplete |
| 4.2 | **Geocode selection** | On place select → get lat/lng for pickup and drop; send to `POST /compare` |
| 4.3 | **Category selector** | UI to choose ride category (Standard, XL, Premium) |
| 4.4 | **Call compare API** | On submit: `POST /compare` with `pickup_lat/lng`, `drop_lat/lng`, `category` |
| 4.5 | **Results UI** | Display ranked list: provider, normalized_category, estimated_price, eta_minutes |
| 4.6 | **FR-5: Redirect** | “Book with [Provider]” opens `redirect_url` in new tab/window; no booking in-app |
| 4.7 | **Disclaimers** | Clear copy: final price/booking with provider; RideCompare only compares and redirects |

**Exit criteria:** User can search locations, select category, see ranked results, and redirect to provider; disclaimers visible.

---

### Phase 5 – Non-Functional & Compliance

| # | Task | Notes |
|---|------|------|
| 5.1 | **Latency** | Ensure p95 response time **&lt; 3 seconds** (parallel calls, timeouts, optional caching of non-price data if allowed) |
| 5.2 | **Security** | Confirm no provider credentials in logs or storage; secrets in env/vault only |
| 5.3 | **Compliance** | Respect provider branding and ToS; no scraping; only official APIs |
| 5.4 | **Observability** | Metrics, logs, traces; track latency, provider errors, redirect success (where measurable) |
| 5.5 | **Error handling** | User-friendly messages when a provider fails; never expose internal keys or stack traces |

**Exit criteria:** p95 &lt; 3s; no credential leakage; observability in place; compliant and safe error handling.

---

## 5. Out of Scope (Do Not Build in MVP)

- Booking or payment inside RideCompare  
- Scraping provider apps or websites  
- Storing historical pricing data  
- Acting as a transportation broker  
- More than two provider adapters (post-MVP)

---

## 6. Success Metrics (from PRD)

- Comparison accuracy within acceptable variance  
- Redirect click-through rate  
- Search-to-redirect conversion rate  
- Latency and uptime (e.g. SLOs, error rate alerts)

---

## 7. Suggested Implementation Order

1. **Phase 1** – Foundation and `POST /compare` shell (mock or empty).  
2. **Phase 2** – One provider adapter first, then second; then resilience.  
3. **Phase 3** – Ranking engine + category normalization + redirect URL generator.  
4. **Phase 4** – Web client: autocomplete → compare → results → redirect + disclaimers.  
5. **Phase 5** – NFRs, security, compliance, observability, and final hardening.

---

## 8. Tech Stack Suggestions (to be decided)

- **Backend:** Node.js (Express/Fastify), Go (Gin/Echo), or Python (FastAPI) – stateless, good for parallel I/O.  
- **Client:** React, Next.js, or Vue with TypeScript.  
- **Maps:** Google Maps Platform or Mapbox for autocomplete and geocoding.  
- **Infra:** API gateway (e.g. AWS API Gateway, Kong, or framework-built); secrets manager; logging/metrics (e.g. Prometheus + Grafana or cloud-native).

---

This plan is the single reference for building the product as per the PRD and Technical PRD. Adjust stack and provider choices to match your team and constraints; keep the API contract and phase boundaries so the product stays compliant and extensible.
