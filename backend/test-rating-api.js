// Test script for rating API endpoint
// Run with: node test-rating-api.js

import dotenv from 'dotenv';
dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 5000}`;

async function testRatingAPI() {
  console.log('🧪 Testing Rating API Endpoints\n');
  console.log(`📡 API URL: ${API_URL}\n`);

  try {
    // Test 1: Get all products (should include rating field)
    console.log('Test 1: GET /products');
    console.log('─'.repeat(50));
    const productsResponse = await fetch(`${API_URL}/products`);
    const products = await productsResponse.json();
    
    if (products.length > 0) {
      console.log('✅ Products fetched successfully');
      console.log(`📊 Total products: ${products.length}`);
      console.log(`🔍 First product:`, {
        id: products[0].id,
        title: products[0].title,
        rating: products[0].rating,
        hasRatingField: 'rating' in products[0]
      });
    } else {
      console.log('⚠️  No products found in database');
      return;
    }

    const testProductId = products[0].id;
    console.log('\n');

    // Test 2: Get single product (should include rating)
    console.log(`Test 2: GET /products/${testProductId}`);
    console.log('─'.repeat(50));
    const productResponse = await fetch(`${API_URL}/products/${testProductId}`);
    const product = await productResponse.json();
    console.log('✅ Product fetched:', {
      id: product.id,
      title: product.title,
      rating: product.rating
    });
    console.log('\n');

    // Test 3: Update rating - Valid value (4.5)
    console.log(`Test 3: PUT /products/${testProductId}/rating (rating: 4.5)`);
    console.log('─'.repeat(50));
    const updateResponse = await fetch(`${API_URL}/products/${testProductId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: 4.5 })
    });
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log('✅ Rating updated successfully:', updateResult);
    } else {
      const error = await updateResponse.json();
      console.log('❌ Update failed:', error);
    }
    console.log('\n');

    // Test 4: Verify the update
    console.log(`Test 4: Verify rating update - GET /products/${testProductId}`);
    console.log('─'.repeat(50));
    const verifyResponse = await fetch(`${API_URL}/products/${testProductId}`);
    const verifiedProduct = await verifyResponse.json();
    console.log('✅ Current rating:', verifiedProduct.rating);
    console.log('✅ Expected: 4.5');
    console.log('✅ Match:', verifiedProduct.rating === 4.5 ? 'YES' : 'NO');
    console.log('\n');

    // Test 5: Invalid rating (too high)
    console.log(`Test 5: PUT /products/${testProductId}/rating (rating: 6) - Should FAIL`);
    console.log('─'.repeat(50));
    const invalidHighResponse = await fetch(`${API_URL}/products/${testProductId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: 6 })
    });
    
    if (!invalidHighResponse.ok) {
      const error = await invalidHighResponse.json();
      console.log('✅ Validation working - rejected high value:', error.error);
    } else {
      console.log('❌ Validation failed - accepted invalid value');
    }
    console.log('\n');

    // Test 6: Invalid rating (negative)
    console.log(`Test 6: PUT /products/${testProductId}/rating (rating: -1) - Should FAIL`);
    console.log('─'.repeat(50));
    const invalidLowResponse = await fetch(`${API_URL}/products/${testProductId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: -1 })
    });
    
    if (!invalidLowResponse.ok) {
      const error = await invalidLowResponse.json();
      console.log('✅ Validation working - rejected negative value:', error.error);
    } else {
      console.log('❌ Validation failed - accepted invalid value');
    }
    console.log('\n');

    // Test 7: Reset to 0
    console.log(`Test 7: PUT /products/${testProductId}/rating (rating: 0)`);
    console.log('─'.repeat(50));
    const resetResponse = await fetch(`${API_URL}/products/${testProductId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: 0 })
    });
    
    if (resetResponse.ok) {
      const resetResult = await resetResponse.json();
      console.log('✅ Rating reset to 0:', resetResult);
    } else {
      const error = await resetResponse.json();
      console.log('❌ Reset failed:', error);
    }
    console.log('\n');

    console.log('═'.repeat(50));
    console.log('✅ All tests completed!');
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nMake sure the backend server is running:');
    console.error('  cd backend');
    console.error('  npm run dev');
  }
}

// Run tests
testRatingAPI();
