const { execSync } = require('child_process');

console.log('Testing Authentication Flow...\n');

// Test 1: Check if the server is running
console.log('1. Checking if server is running...');
try {
  const response = execSync('curl -s http://localhost:3000/api/health', { encoding: 'utf8' });
  console.log('✅ Server is running');
} catch (error) {
  console.log('❌ Server is not running. Please start the server with: npm run dev');
  process.exit(1);
}

// Test 2: Check database connection
console.log('\n2. Testing database connection...');
try {
  const response = execSync('curl -s http://localhost:3000/api/health', { encoding: 'utf8' });
  const health = JSON.parse(response);
  if (health.status === 'ok') {
    console.log('✅ Database connection is working');
  } else {
    console.log('❌ Database connection failed');
  }
} catch (error) {
  console.log('❌ Could not check database connection');
}

// Test 3: Test authentication endpoints
console.log('\n3. Testing authentication endpoints...');

// Test session endpoint without auth
try {
  const response = execSync('curl -s -w "%{http_code}" http://localhost:3000/api/session', { encoding: 'utf8' });
  const statusCode = response.slice(-3);
  if (statusCode === '401') {
    console.log('✅ Session endpoint correctly requires authentication');
  } else {
    console.log('❌ Session endpoint should return 401 without auth');
  }
} catch (error) {
  console.log('❌ Could not test session endpoint');
}

// Test dashboard stats endpoint without auth
try {
  const response = execSync('curl -s -w "%{http_code}" http://localhost:3000/api/dashboard/stats', { encoding: 'utf8' });
  const statusCode = response.slice(-3);
  if (statusCode === '401') {
    console.log('✅ Dashboard stats endpoint correctly requires authentication');
  } else {
    console.log('❌ Dashboard stats endpoint should return 401 without auth');
  }
} catch (error) {
  console.log('❌ Could not test dashboard stats endpoint');
}

console.log('\n✅ Authentication flow tests completed!');
console.log('\nTo test with a real user:');
console.log('1. Register a new user at http://localhost:3000/register');
console.log('2. Login at http://localhost:3000/login');
console.log('3. Check the browser console for authentication logs');
console.log('4. Monitor the server logs for any authentication errors'); 