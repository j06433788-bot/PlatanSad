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

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append(f"{name}: {details}")

    def make_request(self, method, endpoint, data=None, params=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/api{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            
            return response
        except requests.exceptions.RequestException as e:
            return None

    def test_health_endpoints(self):
        """Test health and root endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint
        response = self.make_request('GET', '/')
        success = response and response.status_code == 200
        self.log_test("Root endpoint (/api/)", success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test health endpoint
        response = self.make_request('GET', '/health')
        success = response and response.status_code == 200
        if success and response.json():
            data = response.json()
            success = data.get('status') == 'healthy'
        self.log_test("Health check (/api/health)", success,
                     f"Status: {response.status_code if response else 'No response'}")

    def test_products_endpoints(self):
        """Test products CRUD operations"""
        print("\n🔍 Testing Products Endpoints...")
        
        # Test get all products
        response = self.make_request('GET', '/products')
        success = response and response.status_code == 200
        products = []
        if success:
            products = response.json()
        self.log_test("Get all products", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get products with filters
        response = self.make_request('GET', '/products', params={'search': 'test', 'limit': 5})
        success = response and response.status_code == 200
        self.log_test("Get products with search filter", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test create product
        test_product = {
            "name": f"Test Plant {uuid.uuid4().hex[:8]}",
            "description": "Test plant for API testing",
            "price": 299.99,
            "oldPrice": 399.99,
            "category": "Кімнатні рослини",
            "image": "https://example.com/test-plant.jpg",
            "stock": 10,
            "badges": ["new"],
            "discount": 25
        }
        
        response = self.make_request('POST', '/products', data=test_product)
        success = response and response.status_code == 200
        created_product = None
        if success:
            created_product = response.json()
            self.created_items['products'].append(created_product['id'])
        self.log_test("Create product", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get single product
        if created_product:
            response = self.make_request('GET', f'/products/{created_product["id"]}')
            success = response and response.status_code == 200
            self.log_test("Get single product", success,
                         f"Status: {response.status_code if response else 'No response'}")
        
        # Test update product
        if created_product:
            update_data = {"price": 249.99, "stock": 15}
            response = self.make_request('PUT', f'/products/{created_product["id"]}', data=update_data)
            success = response and response.status_code == 200
            self.log_test("Update product", success,
                         f"Status: {response.status_code if response else 'No response'}")

    def test_categories_endpoints(self):
        """Test categories endpoints"""
        print("\n🔍 Testing Categories Endpoints...")
        
        # Test get all categories
        response = self.make_request('GET', '/categories')
        success = response and response.status_code == 200
        self.log_test("Get all categories", success,
                     f"Status: {response.status_code if response else 'No response'}")

    def test_cart_endpoints(self):
        """Test cart operations"""
        print("\n🔍 Testing Cart Endpoints...")
        
        # First, ensure we have a product to add to cart
        if not self.created_items['products']:
            print("⚠️  No products available for cart testing")
            return
        
        product_id = self.created_items['products'][0]
        user_id = "test_user"
        
        # Test add to cart
        cart_data = {
            "productId": product_id,
            "quantity": 2,
            "userId": user_id
        }
        
        response = self.make_request('POST', '/cart/add', data=cart_data)
        success = response and response.status_code == 200
        cart_item = None
        if success:
            cart_item = response.json()
            self.created_items['cart_items'].append(cart_item['id'])
        self.log_test("Add to cart", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get cart
        response = self.make_request('GET', '/cart', params={'userId': user_id})
        success = response and response.status_code == 200
        self.log_test("Get cart items", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test update cart item
        if cart_item:
            update_data = {"quantity": 3}
            response = self.make_request('PUT', f'/cart/{cart_item["id"]}', data=update_data)
            success = response and response.status_code == 200
            self.log_test("Update cart item", success,
                         f"Status: {response.status_code if response else 'No response'}")

    def test_wishlist_endpoints(self):
        """Test wishlist operations"""
        print("\n🔍 Testing Wishlist Endpoints...")
        
        if not self.created_items['products']:
            print("⚠️  No products available for wishlist testing")
            return
        
        product_id = self.created_items['products'][0]
        user_id = "test_user"
        
        # Test add to wishlist
        wishlist_data = {
            "productId": product_id,
            "userId": user_id
        }
        
        response = self.make_request('POST', '/wishlist/add', data=wishlist_data)
        success = response and response.status_code == 200
        wishlist_item = None
        if success:
            wishlist_item = response.json()
            self.created_items['wishlist_items'].append(wishlist_item['id'])
        self.log_test("Add to wishlist", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get wishlist
        response = self.make_request('GET', '/wishlist', params={'userId': user_id})
        success = response and response.status_code == 200
        self.log_test("Get wishlist items", success,
                     f"Status: {response.status_code if response else 'No response'}")

    def test_orders_endpoints(self):
        """Test order operations"""
        print("\n🔍 Testing Orders Endpoints...")
        
        if not self.created_items['products']:
            print("⚠️  No products available for order testing")
            return
        
        product_id = self.created_items['products'][0]
        
        # Test create order
        order_data = {
            "customerName": "Тест Тестович",
            "customerPhone": "+380501234567",
            "customerEmail": "test@example.com",
            "deliveryAddress": "Київ, вул. Тестова 1",
            "deliveryMethod": "nova_poshta",
            "paymentMethod": "cash_on_delivery",
            "notes": "Тестове замовлення",
            "items": [{
                "productId": product_id,
                "productName": "Test Plant",
                "productImage": "https://example.com/test.jpg",
                "price": 299.99,
                "quantity": 1
            }],
            "totalAmount": 299.99,
            "userId": "test_user",
            "paymentStatus": "pending"
        }
        
        response = self.make_request('POST', '/orders', data=order_data)
        success = response and response.status_code == 200
        order = None
        if success:
            order = response.json()
            self.created_items['orders'].append(order['id'])
        self.log_test("Create order", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get orders
        response = self.make_request('GET', '/orders', params={'userId': 'test_user'})
        success = response and response.status_code == 200
        self.log_test("Get orders", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get single order
        if order:
            response = self.make_request('GET', f'/orders/{order["id"]}')
            success = response and response.status_code == 200
            self.log_test("Get single order", success,
                         f"Status: {response.status_code if response else 'No response'}")

    def test_quick_order_endpoints(self):
        """Test quick order operations"""
        print("\n🔍 Testing Quick Order Endpoints...")
        
        if not self.created_items['products']:
            print("⚠️  No products available for quick order testing")
            return
        
        product_id = self.created_items['products'][0]
        
        # Test create quick order
        quick_order_data = {
            "productId": product_id,
            "quantity": 1,
            "customerName": "Швидкий Покупець",
            "customerPhone": "+380501234567",
            "notes": "Швидке замовлення"
        }
        
        response = self.make_request('POST', '/quick-order', data=quick_order_data)
        success = response and response.status_code == 200
        quick_order = None
        if success:
            quick_order = response.json()
            self.created_items['quick_orders'].append(quick_order['id'])
        self.log_test("Create quick order", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get quick orders
        response = self.make_request('GET', '/quick-orders')
        success = response and response.status_code == 200
        self.log_test("Get quick orders", success,
                     f"Status: {response.status_code if response else 'No response'}")

    def test_liqpay_endpoints(self):
        """Test LiqPay payment endpoints"""
        print("\n🔍 Testing LiqPay Payment Endpoints...")
        
        if not self.created_items['orders']:
            print("⚠️  No orders available for LiqPay testing")
            return
        
        order_id = self.created_items['orders'][0]
        
        # Test create LiqPay checkout
        params = {
            'order_id': order_id,
            'amount': '299.99',
            'description': 'Тестова оплата PlatanSad',
            'result_url': 'http://localhost:3000/order-success/' + order_id,
            'server_url': 'http://localhost:8001/api/liqpay/callback'
        }
        
        response = self.make_request('POST', '/liqpay/create-checkout', params=params)
        success = response and response.status_code == 200
        checkout_data = None
        if success:
            checkout_data = response.json()
            # Verify required fields
            required_fields = ['data', 'signature', 'checkout_url']
            success = all(field in checkout_data for field in required_fields)
        self.log_test("Create LiqPay checkout", success,
                     f"Status: {response.status_code if response else 'No response'}")
        
        # Test get payment status
        response = self.make_request('GET', f'/liqpay/status/{order_id}')
        success = response and response.status_code == 200
        self.log_test("Get payment status", success,
                     f"Status: {response.status_code if response else 'No response'}")

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete created products
        for product_id in self.created_items['products']:
            response = self.make_request('DELETE', f'/products/{product_id}')
            success = response and response.status_code == 200
            if success:
                print(f"✅ Deleted product {product_id}")
        
        # Delete cart items
        for cart_item_id in self.created_items['cart_items']:
            response = self.make_request('DELETE', f'/cart/{cart_item_id}')
            success = response and response.status_code == 200
            if success:
                print(f"✅ Deleted cart item {cart_item_id}")
        
        # Delete wishlist items
        for wishlist_item_id in self.created_items['wishlist_items']:
            response = self.make_request('DELETE', f'/wishlist/{wishlist_item_id}')
            success = response and response.status_code == 200
            if success:
                print(f"✅ Deleted wishlist item {wishlist_item_id}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting PlatanSad Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_products_endpoints()
        self.test_categories_endpoints()
        self.test_cart_endpoints()
        self.test_wishlist_endpoints()
        self.test_orders_endpoints()
        self.test_quick_order_endpoints()
        self.test_liqpay_endpoints()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  • {failure}")
        
        return len(self.failed_tests) == 0

def main():
    """Main test runner"""
    tester = PlatanSadAPITester("http://localhost:8001")
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())