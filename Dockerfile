# 1.aşama: frontend derleme
FROM node:22-alpine AS web

WORKDIR /src/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

# 2.aşama: Go derleme
FROM golang:1.25-alpine AS builder 

WORKDIR /src

COPY go.mod ./
COPY cmd/ ./cmd/
COPY internal/ ./internal/

COPY --from=web /src/internal/web/dist ./internal/web/dist

RUN CGO_ENABLED=0 go build -o /teasol ./cmd/server

# 3.aşama: çalıştırma
FROM alpine:3.21

RUN adduser -D -u 10001 app

COPY --from=builder /teasol /teasol

USER app

ENV PORT=8081

EXPOSE 8081

HEALTHCHECK --interval=10s --timeout=3s --start-period=3s --retries=3 CMD wget --quiet --spider --tries=1 http://127.0.0.1:${PORT}/healthz || exit 1

ENTRYPOINT ["/teasol"]

