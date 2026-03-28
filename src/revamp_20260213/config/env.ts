export const ENV = {
  mode: import.meta.env.MODE,
  // Always use mock data — real API is not yet connected.
  // This ensures all data-fetching pages work on GitHub Pages.
  useMock: true,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  iapEnabled: import.meta.env.MODE !== "development",
};
