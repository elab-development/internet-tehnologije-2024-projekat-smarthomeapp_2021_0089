from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
import settings
import models,logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.DB_USERNAME}:{settings.DB_PASSWORD}@{settings.DB_HOSTNAME}:{settings.DB_PORT}/{settings.DATABASE_NAME}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

#models.Base.metadata.create_all(engine)

try:
    # Pokušajte da se povežete na bazu
    with engine.connect() as connection:
        print("Konekcija je uspešna!")
except Exception as e:
    print("Greška pri konekciji:", e)

inspector = inspect(engine)
tables = inspector.get_table_names()

print("Tables in the database:", tables)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()