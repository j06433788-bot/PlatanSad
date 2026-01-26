"""
Очищення бази даних від тестових замовлень
"""
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from database import Order, Base

# Database setup
SYNC_DATABASE_URL = "sqlite:///./platansad.db"
engine = create_engine(SYNC_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def clear_orders():
    """Очистити всі замовлення"""
    print("="*70)
    print("🗑️  ОЧИЩЕННЯ ЗАМОВЛЕНЬ")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # Підрахувати кількість замовлень
        count = db.query(Order).count()
        print(f"\n📊 Знайдено замовлень: {count}")
        
        if count == 0:
            print("✅ База даних вже чиста")
            return
        
        # Підтвердження
        confirm = input(f"\n⚠️  Видалити всі {count} замовлень? (yes/no): ")
        if confirm.lower() != 'yes':
            print("❌ Операцію скасовано")
            return
        
        # Видалити всі замовлення
        db.execute(delete(Order))
        db.commit()
        
        print(f"\n✅ Успішно видалено {count} замовлень")
        print("="*70)
        
    except Exception as e:
        print(f"❌ Помилка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_orders()
