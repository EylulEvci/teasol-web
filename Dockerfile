FROM golang:1.25-alpine AS builder

WORKDIR /src

COPY . .

RUN CGO_ENABLED=0 go build -o /teasol ./cmd/server

FROM alpine:3.21

COPY --from=builder /teasol /teasol

EXPOSE 8081

ENTRYPOINT ["/teasol"]

