// src/lib/microservices.ts
import adminService from './admin';
import aiService from './ai';

export const microservices = {
  'x-tweet-admin': adminService,
  'x-tweet-ai': aiService,
};
