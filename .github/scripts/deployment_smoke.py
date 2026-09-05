"""Verify the deployed web SPA without logging credentials or response bodies."""

import os
import time
import urllib.error
import urllib.parse
import urllib.request


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        # Do not forward the automation bypass credential to a login/other host.
        return None


def main() -> None:
    base = os.environ["DEPLOYMENT_URL"].strip().rstrip("/")
    parsed = urllib.parse.urlsplit(base)
    if (
        parsed.scheme != "https"
        or not parsed.hostname
        or not parsed.hostname.endswith(".vercel.app")
    ):
        raise SystemExit("Expected an HTTPS Vercel deployment URL")
    headers = {}
    opener = urllib.request.build_opener(NoRedirect())
    if bypass := os.environ.get("VERCEL_AUTOMATION_BYPASS_SECRET"):
        headers["x-vercel-protection-bypass"] = bypass
    for path in ("/", "/app"):
        for attempt in range(5):
            try:
                request = urllib.request.Request(base + path, headers=headers)
                with opener.open(request, timeout=20) as response:
                    valid = (
                        response.status == 200
                        and "text/html" in response.headers.get("Content-Type", "")
                        and b'id="root"' in response.read()
                    )
                    if not valid:
                        raise ValueError("Response is not the expected SPA")
                break
            except (urllib.error.URLError, ValueError) as error:
                if attempt == 4:
                    raise SystemExit(
                        f"Deployment smoke failed for {path}: {type(error).__name__}"
                    ) from None
                time.sleep(5)
    print("Deployed web root and application route passed smoke checks.")


if __name__ == "__main__":
    main()
