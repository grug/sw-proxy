function shouldSendRequestToProxy(request: Request, vendorAllowlist: string[]) {
  const hostname = new URL(request.url).hostname.replace("www.", "");

  return vendorAllowlist.includes(hostname);
}

export { shouldSendRequestToProxy };
