export function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const h = req.header("x-test-now-ms");
    if (h) return new Date(Number(h));
  }
  return new Date();
}
