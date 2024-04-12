import relayConfig from "./relay.config.json" assert { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    relay: relayConfig
  },
  reactStrictMode: false
};

export default nextConfig;
