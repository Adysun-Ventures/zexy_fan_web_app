export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.zexy.live',
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001',
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxx',
  IS_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
} as const;
