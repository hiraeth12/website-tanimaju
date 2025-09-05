// Quick test for timezone function
import { getCurrentDateGMT7, getCurrentTimeGMT7 } from './src/utils/timezone.js';

console.log('Current UTC date:', new Date().toISOString().split('T')[0]);
console.log('Current GMT+7 time:', getCurrentTimeGMT7());
console.log('Current GMT+7 date:', getCurrentDateGMT7());
