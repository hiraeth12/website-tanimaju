// backend/test-session-api.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
let sessionKey = '';
let token = '';
let userId = 0;

// Test credentials - you may need to change these
const TEST_USER = {
  email: 'admin@tanimaju.com',
  password: 'admin123' // Change this to your actual admin password
};

console.log('🧪 Testing Session Management API\n');
console.log('Base URL:', BASE_URL);
console.log('─'.repeat(60));

// Test 1: Login
async function testLogin() {
  console.log('\n📝 Test 1: Login with session generation');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful');
      console.log('   User:', data.user.email);
      console.log('   Role:', data.user.role);
      console.log('   Session Key:', data.sessionKey?.substring(0, 20) + '...');
      console.log('   Expires At:', data.sessionExpiresAt);
      
      sessionKey = data.sessionKey;
      token = data.token;
      userId = data.user.id;
      
      return true;
    } else {
      console.log('❌ Login failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 2: Check session status
async function testSessionStatus() {
  console.log('\n📝 Test 2: Check session status');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': sessionKey
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Session status retrieved');
      console.log('   Has Session:', data.session.hasSession);
      console.log('   Is Expired:', data.session.isExpired);
      console.log('   Minutes Remaining:', data.session.minutesRemaining);
      return true;
    } else {
      console.log('❌ Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 3: Access protected route with session
async function testProtectedRoute() {
  console.log('\n📝 Test 3: Access protected route with session');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': sessionKey
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Protected route accessible');
      console.log('   User:', data.user.email);
      return true;
    } else {
      console.log('❌ Access denied:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 4: Refresh session
async function testRefreshSession() {
  console.log('\n📝 Test 4: Refresh session');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': sessionKey
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Session refreshed');
      console.log('   New Session Key:', data.sessionKey?.substring(0, 20) + '...');
      console.log('   New Expires At:', data.sessionExpiresAt);
      
      sessionKey = data.sessionKey; // Update to new session key
      
      return true;
    } else {
      console.log('❌ Refresh failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 5: Try with invalid session key
async function testInvalidSession() {
  console.log('\n📝 Test 5: Try invalid session key');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': 'invalid-session-key-12345'
      }
    });
    
    const data = await response.json();
    
    if (!data.success && response.status === 401) {
      console.log('✅ Invalid session rejected correctly');
      console.log('   Message:', data.message);
      return true;
    } else {
      console.log('❌ Invalid session was accepted (security issue!)');
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 6: Logout and clear session
async function testLogout() {
  console.log('\n📝 Test 6: Logout and clear session');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': sessionKey
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Logout successful');
      console.log('   Message:', data.message);
      return true;
    } else {
      console.log('❌ Logout failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Test 7: Verify session cleared after logout
async function testSessionAfterLogout() {
  console.log('\n📝 Test 7: Verify session cleared after logout');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-Key': sessionKey
      }
    });
    
    const data = await response.json();
    
    if (!data.success && response.status === 401) {
      console.log('✅ Session correctly invalidated after logout');
      return true;
    } else {
      console.log('❌ Session still valid after logout (issue!)');
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Starting session management tests...\n');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // Run tests sequentially
  const tests = [
    testLogin,
    testSessionStatus,
    testProtectedRoute,
    testRefreshSession,
    testInvalidSession,
    testLogout,
    testSessionAfterLogout
  ];
  
  for (const test of tests) {
    results.total++;
    const passed = await test();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests:  ${results.total}`);
  console.log(`✅ Passed:     ${results.passed}`);
  console.log(`❌ Failed:     ${results.failed}`);
  console.log('='.repeat(60));
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Session management is working correctly.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running at', BASE_URL);
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  
  await runTests();
})();
