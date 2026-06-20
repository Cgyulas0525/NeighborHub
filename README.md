# NeighborHub

Helyi közösségi platform Vác és környéke számára – Laravel 13 API + React + Tailwind, Docker Compose.

## Gyors indítás

```bash
cd ~/Projects/NeighborHub
cp .env.example .env
cp backend/.env.docker.example backend/.env

docker compose up -d --build
docker compose exec app php artisan migrate --seed
```

Nyisd meg: **http://localhost:8088**

## Portok (ütközésmentes a többi MentesHetes projekttel)

| Szolgáltatás | Port |
|--------------|------|
| Web (Nginx) | 8088 |
| MySQL | 3312 |
| Redis | 6382 |
| Mailhog UI | 8028 |
| Mailhog SMTP | 1030 |
| Vite (közvetlen) | 5174 |

## Admin teszt fiók (seed után)

- E-mail: `admin@neighborhub.local`
- Jelszó: `password`

## Struktúra

```
NeighborHub/
├── backend/          Laravel 13 API
├── frontend/         React + Vite + Tailwind 4
├── docker/           PHP-FPM, Nginx
└── docker-compose.yml
```

## API (első kör)

- `GET /api/cities`, `/categories`, `/skills`
- `POST /api/register`, `/login`, `/logout`
- `GET|PUT /api/profile/me`
- `GET|POST|PUT|DELETE /api/services`, `/products`
- `POST /api/recommendations`
- `GET /api/questions`, `POST /api/questions/{id}/answers`

Részletes terv: `~/Obsidian/NeighborHub/Fejlesztői terv.md`

## Következő lépések (MVP)

- [ ] Admin dashboard
- [ ] Ajánlások moderálása
- [ ] Képfeltöltés profilhoz/termékhez
- [ ] Tesztadat seed (50 user, 30 service…)
