/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // next dev 가 AGENTS.md / CLAUDE.md 같은 AI 도구용 파일을 만들지 않도록 끈다.
  agentRules: false,
};

export default nextConfig;
