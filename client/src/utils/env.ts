const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  NODE_ENV: import.meta.env.MODE as string,
};

export default env;
