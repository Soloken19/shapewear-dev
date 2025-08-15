#!/usr/bin/env python3
"""
CurveCraft Backend API Tests
Tests all backend endpoints for the CurveCraft shapewear app
"""

import requests
import sys
import json
from datetime import datetime

class CurveCraftAPITester:
    def __init__(self, base_url="http://0.0.0.0:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_keys=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                print(f"❌ Failed - Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Parse response
                try:
                    response_data = response.json()
                    
                    # Check for expected keys if provided
                    if expected_keys:
                        for key in expected_keys:
                            if key not in response_data:
                                print(f"⚠️  Warning - Expected key '{key}' not found in response")
                            else:
                                print(f"   ✓ Found expected key: {key}")
                    
                    return True, response_data
                except json.JSONDecodeError:
                    print(f"⚠️  Warning - Response is not valid JSON")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error details: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Unexpected error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200,
            expected_keys=["status"]
        )
        if success and response.get("status") == "ok":
            print("   ✓ Health status is 'ok'")
            return True
        elif success:
            print(f"   ⚠️  Health status is '{response.get('status')}', expected 'ok'")
        return False

    def test_products_endpoint(self):
        """Test the products listing endpoint"""
        success, response = self.run_test(
            "Products List",
            "GET",
            "api/products",
            200,
            expected_keys=["products"]
        )
        if success:
            products = response.get("products", [])
            print(f"   ✓ Found {len(products)} products")
            if len(products) >= 6:
                print("   ✓ Products count >= 6 as expected")
                return True, products
            else:
                print(f"   ⚠️  Expected at least 6 products, found {len(products)}")
                return False, products
        return False, []

    def test_product_by_slug(self, slug="sculptfit-seamless-bodysuit"):
        """Test getting a specific product by slug"""
        success, response = self.run_test(
            f"Product by Slug ({slug})",
            "GET",
            f"api/products/{slug}",
            200,
            expected_keys=["product"]
        )
        if success:
            product = response.get("product", {})
            if product.get("slug") == slug:
                print(f"   ✓ Product slug matches: {slug}")
                return True, product
            else:
                print(f"   ⚠️  Product slug mismatch. Expected: {slug}, Got: {product.get('slug')}")
        return False, {}

    def test_checkout_endpoint(self):
        """Test the checkout endpoint with sample cart"""
        sample_cart = {
            "items": [
                {
                    "id": "test-id-1",
                    "slug": "sculptfit-seamless-bodysuit",
                    "name": "SculptFit Seamless Bodysuit",
                    "price": 78.0,
                    "qty": 1,
                    "size": "M",
                    "color": "Black"
                }
            ],
            "email": "test@example.com",
            "address": {
                "street": "123 Test St",
                "city": "Test City",
                "state": "TS",
                "zip": "12345"
            }
        }
        
        success, response = self.run_test(
            "Checkout",
            "POST",
            "api/checkout",
            200,
            data=sample_cart,
            expected_keys=["orderId", "total", "message"]
        )
        if success:
            order_id = response.get("orderId")
            total = response.get("total")
            if order_id:
                print(f"   ✓ Order ID generated: {order_id}")
            if total == 78.0:
                print(f"   ✓ Total matches expected: ${total}")
                return True, response
            else:
                print(f"   ⚠️  Total mismatch. Expected: $78.0, Got: ${total}")
        return False, {}

    def test_invalid_product_slug(self):
        """Test 404 handling for invalid product slug"""
        success, response = self.run_test(
            "Invalid Product Slug (404 test)",
            "GET",
            "api/products/non-existent-product",
            404
        )
        return success

    def test_empty_cart_checkout(self):
        """Test checkout with empty cart should return 400"""
        empty_cart = {"items": []}
        success, response = self.run_test(
            "Empty Cart Checkout (400 test)",
            "POST",
            "api/checkout",
            400,
            data=empty_cart
        )
        return success

def main():
    print("🚀 Starting CurveCraft Backend API Tests")
    print("=" * 50)
    
    # Initialize tester
    tester = CurveCraftAPITester()
    
    # Run all tests
    print("\n📋 Running Core API Tests...")
    
    # 1. Health check
    health_ok = tester.test_health_endpoint()
    
    # 2. Products listing
    products_ok, products = tester.test_products_endpoint()
    
    # 3. Product by slug
    product_ok, product = tester.test_product_by_slug()
    
    # 4. Checkout
    checkout_ok, checkout_response = tester.test_checkout_endpoint()
    
    print("\n📋 Running Error Handling Tests...")
    
    # 5. Invalid product slug (404)
    invalid_product_ok = tester.test_invalid_product_slug()
    
    # 6. Empty cart checkout (400)
    empty_cart_ok = tester.test_empty_cart_checkout()
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    # Detailed results
    core_tests = [health_ok, products_ok, product_ok, checkout_ok]
    error_tests = [invalid_product_ok, empty_cart_ok]
    
    print(f"\nCore API Tests: {sum(core_tests)}/4 passed")
    print(f"Error Handling Tests: {sum(error_tests)}/2 passed")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All tests passed! Backend is ready for frontend integration.")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} test(s) failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())