---
title: Benchmarks
description: Performance benchmarks for MoniGo operations
---

## Micro-Benchmarks (Apple M4)

| Operation | ns/op |
|---|---|
| GetCoreStatistics | 235 |
| CalculateOverallLoad | 139 |
| ConstructRawMemStats | 273 |
| InMemoryStorage Insert | 84 |
| InMemoryStorage Select (1000 pts) | 4,116 |
| StoreServiceMetrics | 7,513 |
| BytesToUnit | 140 |
| ConvertBytesToUnit | 4 |

## Run Benchmarks Yourself

```bash
go test -bench=. -benchmem -benchtime=10s ./...
```

## Performance Highlights

- **Sub-microsecond operations** — Core metric calculations complete in under 300 ns.
- **Fast storage inserts** — In-memory storage inserts at 84 ns per data point.
- **Efficient queries** — Selecting 1,000 data points takes ~4 μs.
- **Zero-overhead tracing** — Non-sampled function calls add sub-millisecond overhead thanks to adaptive sampling.
