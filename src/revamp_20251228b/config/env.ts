export const ENV = {
  mode: import.meta.env.MODE,
  useMock: import.meta.env.MODE === "development",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  iapEnabled: import.meta.env.MODE !== "development",
};
