// eslint-disable-next-line
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line
const ignored = self.__WB_MANIFEST;

self.addEventListener("fetch", handleFetch);

function handleFetch(event: FetchEvent) {
  const vendorAllowlist = ["analytics.google.com", "honeycomb.io"];

  event.respondWith(
    (function () {
      return shouldSendRequestToProxy(event.request, vendorAllowlist)
        ? fetch(generateProxyRequest(event.request))
        : fetch(event.request);
    })()
  );
}

function shouldSendRequestToProxy(request: Request, vendorAllowlist: string[]) {
  const hostname = new URL(request.url).hostname.replace("www.", "");

  return vendorAllowlist.includes(hostname);
}

function generateProxyRequest(request: Request) {
  const { headers, method, url } = request;

  const proxyBaseUrl = "someproxy.com";

  const proxyUrl = `${url
    .replace("www.", "")
    .replace(/\./g, "_")}.${proxyBaseUrl}`;

  const proxyRequest = new Request(proxyUrl, {
    headers,
    method,
  });

  return proxyRequest;
}

export { handleFetch, shouldSendRequestToProxy, generateProxyRequest };
