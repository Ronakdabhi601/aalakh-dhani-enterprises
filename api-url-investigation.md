# Native API URL investigation

- The user-provided URL `https://manus.im/app-preview/...` opens the Manus login/preview wrapper, not a direct project backend endpoint.
- It must not be used as `EXPO_PUBLIC_API_BASE_URL`, because it returns an HTML page and causes `JSON Parse error: Unexpected character: <` in native API calls.
- The project metadata exposes the running API port as `3000`, and the active sandbox host is `ibdvncdc4l3wqixvcp147-bd0ce391.us3.manus.computer`.
- A smoke request to `https://3000-ibdvncdc4l3wqixvcp147-bd0ce391.us3.manus.computer/api/trpc/members.getAll` returned HTTP 200 with `application/json`, confirming the current sandbox backend host.
- This sandbox host is a development endpoint, not a stable production deployment URL. Native APK distribution should use a stable published backend URL.
