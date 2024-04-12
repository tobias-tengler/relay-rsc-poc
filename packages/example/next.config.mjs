import relayConfig from "./relay.config.json" assert { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    relay: relayConfig
  },
};

export default nextConfig;
