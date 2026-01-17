#!/usr/bin/env python3
"""
PlatanSad Backend API Testing Suite
Tests all backend endpoints for the Ukrainian plant store
"""

import requests
import sys
import json
from datetime import datetime
import uuid

class PlatanSadAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.created_items = {
            'products': [],
            'cart_items': [],
            'wishlist_items': [],
            'orders': [],
            'quick_orders': []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                        if len(response_data) > 0:
                            print(f"   First item keys: {list(response_data[0].keys()) if response_data[0] else 'Empty'}")
                    else:
                        print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Not a dict'}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_get_products(self):
        """Test getting products with limit"""
        success, response = self.run_test(
            "Get Products (limit=5)",
            "GET",
            "api/products",
            200,
            params={"limit": 5}
        )
        return success, response

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "api/categories",
            200
        )
        return success, response

    def test_get_single_product(self, product_id):
        """Test getting a single product"""
        success, response = self.run_test(
            f"Get Single Product ({product_id})",
            "GET",
            f"api/products/{product_id}",
            200
        )
        return success, response

def main():
    print("🌱 PlatanSad API Testing Started")
    print("=" * 50)
    
    # Setup
    tester = PlatanSadAPITester()

    # Test 1: Health Check
    print("\n📋 BACKEND API TESTS")
    print("-" * 30)
    
    if not tester.test_health_check():
        print("❌ Health check failed, API may be down")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1

    # Test 2: Get Products
    products_success, products_data = tester.test_get_products()
    product_id = None
    if products_success and isinstance(products_data, list) and len(products_data) > 0:
        product_id = products_data[0].get('id')
        print(f"   Found {len(products_data)} products")
        if product_id:
            print(f"   First product ID: {product_id}")

    # Test 3: Get Categories  
    categories_success, categories_data = tester.test_get_categories()
    if categories_success and isinstance(categories_data, list):
        print(f"   Found {len(categories_data)} categories")

    # Test 4: Get Single Product (if we have a product ID)
    if product_id:
        tester.test_get_single_product(product_id)

    # Print final results
    print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())