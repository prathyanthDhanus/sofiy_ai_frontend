/**
 * Centralized API Endpoints
 * All service endpoints are defined here for consistent management.
 */

export const ENDPOINTS = {
  //・・・・・ AUTHENTICATION ENDPOINTS ・・・・・

  AUTH: {
    REQUEST_OTP: "/auth/request-otp",
    VERIFY_OTP: "/auth/verify-otp",
    LOGIN_PASSWORD: "/auth/login",
    GOOGLE_AUTH: "/auth/google",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    ME: "/auth/me",
  },

  //・・・・・ USER ENDPOINTS ・・・・・
  
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },

  //・・・・・ MEDIA ENDPOINTS ・・・・・
  MEDIA: {
    UPLOAD: "/media/upload",
  },
} as const;

export type EndpointsType = typeof ENDPOINTS;
