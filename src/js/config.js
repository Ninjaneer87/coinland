const productionApi = "https://coinland-next.vercel.app/api/v1";
const developmentApi = "http://localhost:3000/api/v1";
const host =
  process.env.NODE_ENV === "production" ? productionApi : developmentApi;
export const ALLCOINS_URI = `${host}/latest`;
export const METADATA_URI = `${host}/metadata`;
export const GLOBALS_URI = `${host}/globals`;
