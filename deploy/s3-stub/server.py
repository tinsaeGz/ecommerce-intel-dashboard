from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Handler(BaseHTTPRequestHandler):
    server_version = "SuqS3Stub/0.1"

    def do_GET(self) -> None:
        if self.path in {"/health/live", "/health/ready"}:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/xml")
            self.end_headers()
            self.wfile.write(
                b'<?xml version="1.0" encoding="UTF-8"?>'
                b'<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">'
                b'<Buckets /></ListAllMyBucketsResult>'
            )
            return
        self.send_response(404)
        self.send_header("Content-Type", "application/xml")
        self.end_headers()
        self.wfile.write(b'<Error><Code>NoSuchKey</Code></Error>')

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 9000), Handler).serve_forever()
