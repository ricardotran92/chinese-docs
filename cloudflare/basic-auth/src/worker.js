const DEFAULT_REALM = "Chinese Docs";

function constantTimeEquals(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

function challengeResponse(realm = DEFAULT_REALM) {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function parseBasicAuth(headerValue) {
  if (!headerValue) {
    return null;
  }

  const [scheme, encoded] = headerValue.split(/\s+/, 2);
  if (!scheme || scheme.toLowerCase() !== "basic" || !encoded) {
    return null;
  }

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function isAuthorized(request, env) {
  const credentials = parseBasicAuth(request.headers.get("Authorization"));
  if (!credentials) {
    return false;
  }

  const expectedUser = env.BASIC_AUTH_USER;
  const expectedPassword = env.BASIC_AUTH_PASSWORD;
  if (typeof expectedUser !== "string" || typeof expectedPassword !== "string") {
    return false;
  }

  return (
    constantTimeEquals(credentials.username, expectedUser) &&
    constantTimeEquals(credentials.password, expectedPassword)
  );
}

function joinPaths(basePath, requestPath) {
  const normalizedBase = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;
  const normalizedRequest = requestPath.startsWith("/")
    ? requestPath
    : `/${requestPath}`;

  if (normalizedRequest === "/") {
    return `${normalizedBase}/`;
  }

  return `${normalizedBase}${normalizedRequest}`;
}

function buildUpstreamUrl(requestUrl, originBaseUrl) {
  const origin = new URL(originBaseUrl);
  const upstream = new URL(origin.toString());
  upstream.pathname = joinPaths(origin.pathname, requestUrl.pathname);
  upstream.search = requestUrl.search;
  return upstream;
}

async function proxyRequest(request, env) {
  const originBaseUrl = env.ORIGIN_BASE_URL;
  if (typeof originBaseUrl !== "string" || originBaseUrl.length === 0) {
    return new Response("Missing ORIGIN_BASE_URL", { status: 500 });
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = buildUpstreamUrl(requestUrl, originBaseUrl);
  const headers = new Headers(request.headers);
  headers.delete("authorization");

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  return fetch(upstreamUrl.toString(), init);
}

export default {
  async fetch(request, env) {
    const realm = env.REALM || DEFAULT_REALM;

    if (!isAuthorized(request, env)) {
      return challengeResponse(realm);
    }

    return proxyRequest(request, env);
  },
};
