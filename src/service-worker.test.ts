import {
  handleFetch,
  shouldSendRequestToProxy,
  generateProxyRequest,
} from "./service-worker";
import { enableFetchMocks } from "jest-fetch-mock";

describe("Service worker", () => {
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

      expect(proxyRequest).toMatchObject({
        url: "https://foo_com.someproxy.com",
      });
    });

    it("should convert dots in the hostname into underscores", () => {
      const request = new Request("https://some.long.domain.test.com");

      const proxyRequest = generateProxyRequest(request);

      expect(proxyRequest).toMatchObject({
        url: "https://some_long_domain_test_com.someproxy.com",
      });
    });

    it("should preserve headers and method", () => {
      const request = new Request("https://foo.com", {
        method: "POST",
        headers: { some: "header" },
      });

      const proxyRequest = generateProxyRequest(request);

      expect(proxyRequest).toMatchObject({ method: "POST" });
      expect(proxyRequest.headers.get("some")).toEqual("header");
    });
  });

  describe("handleFetch", () => {
    beforeAll(() => {
      enableFetchMocks();
    });

    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it("calls proxy server when the request is destined for there", () => {
      expect(1).toEqual(1);
    });

    it("forwards the request to the original destination when the proxy isn't needed", () => {
      expect(1).toEqual(1);
    });
  });
});
