from sqlalchemy import create_engine,text

# Format URL-a: mysql+mysqlconnector://<user>:<password>@<host>:<port>/<database>
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/baze_podataka"

# Kreiranje engine-a
engine = create_engine(DATABASE_URL)

# Testiranje konekcije
with engine.connect() as connection:
    result = connection.execute(text("SELECT * FROM korisnici"))
    for row in result:
        print(row)
        
 
