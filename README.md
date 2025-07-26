![Logo](images/logo.png)
# SmartHome aplikacija
SmartHome je web aplikacija pomoću koje korisnicu mogu da upravljaju pametnim uređajima u svom domu.

# Tehnologije i pokretanje aplikacije

Za razvoj backend dela aplikacije je korišćen FastAPI frejmvork, a za razvoj frontenda React. Korišćena je i Chakra UI biblioteka komponenti, a za bazu DBMS MySql.

## Backend

Instalirati Python i pip (python paket menazder). Pogledati sledeće linkove: https://www.python.org/downloads/ https://packaging.python.org/en/latest/tutorials/installing-packages/
Potrebno je napraviti python virtuelno okruženje, ukoliko ga već nemaš, pomoću komande: ```python3 -m venv .venv```, a zatim ga i aktivirati pomoću ```source .venv/bin/activate```.
- Pozicionirati se u backend i instalirati potrebne pakete pomoću komande: ```pip install -r requirements.txt```
- Pokretanje migracija za bazu podataka: ```alembic upgrade head``` (Napomena: Potrebno je imati kreiranu bazu pre pokretanja.)
- Pokretanje servera: pozicionirati se u backend/app, pa pokrenuti komandu ```uvicorn main:app --reload```

## Frontend

Instalirati Node.js i npm (node paket menadzer). Pogledati sledeći link: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- Pozicionirati se u frontend i instalirati potrebne pakete pomoću komande: ```npm install```
- Pokretanje aplikacije: ```npm start```

# Najvažnije funkcionalnosti aplikacije

1. Prijava i registracija korisnika putem e-maila i lozinke sa JWT autentifikacijom  
2. Upravljanje ulogama korisnika (admin, vlasnik, obični korisnici)  
3. Dodavanje, izmena i brisanje pametnih uređaja   
4. Admin panel za dodelu uloga i lokacija
5. Web interfejs za pristup funkcionalnostima sistema

# Izgled aplikacije

|    |    |
|:-------:|:-------:|
|<img src="/images/login.png" width="500">|<img src="/images/register.png" width="500">|
|**Log in**|**Register**|
|    |    |
|<img src="/images/dashboard.png" width="500">|<img src="/images/devices.png" width="500">|
|**Dashboard**|**Devices**|
|    |    |
|<img src="/images/admin.png" width="500">|<img src="/images/profile.png" width="500">|
|**Admin panel**|**Profile**|











