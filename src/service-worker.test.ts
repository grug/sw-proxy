import { generateProxyRequest } from "./service-worker";
import { shouldSendRequestToProxy } from "./service-worker-utils";
import { enableFetchMocks } from "jest-fetch-mock";

describe("Service worker", () => {
  beforeAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
    enableFetchMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("shouldSendRequestToProxy", () => {
    it("should return true when hostname of request is in vendor allowlist", () => {
      const request = new Request("https://foo.com");

      expect(shouldSendRequestToProxy(request, ["foo.com"])).toEqual(true);
    });

    it("should return false when the hostname of the request is not in the vendor allowlist", () => {
      const request = new Request("https://foo.com");

      expect(shouldSendRequestToProxy(request, ["bar.com"])).toEqual(false);
    });
  });

  describe("generateProxyRequest", () => {
    it("should generate the correct request to be sent to the proxy server", () => {
      const request = new Request("https://foo.com");

      const proxyRequest = generateProxyRequest(request);

      expect(proxyRequest).toEqual(
        expect.objectContaining({ url: "https://foo_com.someproxy.com/" })
      );
    });

    it("should convert dots in the hostname into underscores", () => {
      const request = new Request("https://some.long.domain.test.com");

      const proxyRequest = generateProxyRequest(request);

      expect(proxyRequest.url).toEqual(
        "https://some_long_domain_test_com.someproxy.com/"
      );
    });

    it("should preserve headers and method", () => {
      const request = new Request("https://foo.com", {
        method: "POST",
        headers: { some: "header" },
      });

      const proxyRequest = generateProxyRequest(request);

      expect(proxyRequest).toEqual(expect.objectContaining({ method: "POST" }));
      expect(proxyRequest.headers.get("some")).toEqual("header");
    });
  });

  describe("handleFetch", () => {
    it("calls proxy server when the request is destined for the proxy", () => {
      jest.doMock("./service-worker-utils", () => ({
        shouldSendRequestToProxy: jest.fn().mockImplementation(() => true),
      }));
      const { handleFetch } = require("./service-worker");
      fetchMock.mockImplementation((val) => {
        const symbol = Object.getOwnPropertySymbols(val)[1];
        // @ts-ignore
        return val[symbol];
      });

      const event = {
        respondWith: jest.fn(),
        request: new Request("https://analytics.google.com"),
      } as unknown as FetchEvent;

      handleFetch(event);

      expect(event.respondWith).toHaveBeenCalledWith(
        expect.objectContaining({
          parsedURL: expect.objectContaining({
            host: "analytics_google_com.someproxy.com",
          }),
        })
      );
    });

    it("forwards the request to the original destination when the proxy isn't needed", () => {
      jest.doMock("./service-worker-utils", () => ({
        shouldSendRequestToProxy: jest.fn().mockImplementation(() => false),
      }));
      const { handleFetch } = require("./service-worker");
      fetchMock.mockImplementation((val) => {
        const symbol = Object.getOwnPropertySymbols(val)[1];
        // @ts-ignore
        return val[symbol];
      });

      const event = {
        respondWith: jest.fn(),
        request: new Request("https://analytics.google.com"),
      } as unknown as FetchEvent;

      handleFetch(event);

      expect(event.respondWith).toHaveBeenCalledWith(
        expect.objectContaining({
          parsedURL: expect.objectContaining({
            host: "analytics.google.com",
          }),
        })
      );
    });
  });
});
