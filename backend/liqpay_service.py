"""
LiqPay Payment Service - Sandbox Mode
"""
import hashlib
import base64
import json
import os
from datetime import datetime
import uuid

# LiqPay Sandbox credentials (test mode)
# Ці ключі з офіційної документації LiqPay для тестування
LIQPAY_PUBLIC_KEY = "sandbox_i00000000000"  # Test public key
LIQPAY_PRIVATE_KEY = "sandbox_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Test private key

class LiqPayService:
    def __init__(self, public_key=LIQPAY_PUBLIC_KEY, private_key=LIQPAY_PRIVATE_KEY):
        self.public_key = public_key
        self.private_key = private_key
    
    def _make_signature(self, data: str) -> str:
        """Generate SHA1 signature for LiqPay request"""
        sign_string = self.private_key + data + self.private_key
        signature = base64.b64encode(
            hashlib.sha1(sign_string.encode('utf-8')).digest()
        ).decode('ascii')
        return signature
    
    def create_checkout_data(
        self,
        amount: float,
        order_id: str,
        description: str,
        currency: str = "UAH",
        result_url: str = None,
        server_url: str = None,
    ) -> dict:
        """
        Create checkout form data for LiqPay payment widget
        Returns data and signature for the payment form
        """
        params = {
            "public_key": self.public_key,
            "version": "3",
            "action": "pay",
            "amount": str(amount),
            "currency": currency,
            "description": description,
            "order_id": order_id,
            "sandbox": "1",  # Enable sandbox mode
            "language": "uk",
        }
        
        if result_url:
            params["result_url"] = result_url
        if server_url:
            params["server_url"] = server_url
        
        # Encode data to base64 - use compact JSON (no spaces)
        json_string = json.dumps(params, separators=(',', ':'), ensure_ascii=False)
        data = base64.b64encode(json_string.encode('utf-8')).decode('ascii')
        
        # Generate signature
        signature = self._make_signature(data)
        
        return {
            "data": data,
            "signature": signature,
            "checkout_url": "https://www.liqpay.ua/api/3/checkout"
        }
    
    def verify_callback(self, data: str, signature: str) -> bool:
        """Verify callback signature from LiqPay"""
        calculated_signature = self._make_signature(data)
        return calculated_signature == signature
    
    def decode_callback_data(self, data: str) -> dict:
        """Decode base64 encoded callback data"""
        try:
            decoded = base64.b64decode(data).decode('utf-8')
            return json.loads(decoded)
        except Exception as e:
            return {"error": str(e)}
    
    def get_payment_status_text(self, status: str) -> str:
        """Get human readable payment status in Ukrainian"""
        statuses = {
            "success": "Оплачено",
            "failure": "Помилка оплати",
            "error": "Помилка",
            "wait_accept": "Очікує підтвердження",
            "processing": "Обробляється",
            "sandbox": "Тестовий платіж (успішно)",
            "reversed": "Повернено",
            "refund": "Повернення коштів",
        }
        return statuses.get(status, status)

# Global service instance
liqpay_service = LiqPayService()
