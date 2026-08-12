# main-deploy

Монорепозиторий с пятью независимыми hospitality-сайтами и общим деплоем на один VPS (`*.soshallitbe.cyou`).

Каждый сайт — свой код, PostgreSQL и порты. Общий стек: **Next.js** (витрина) + **Django/DRF** (API, админка, медиа). Runbook: [`deploy/README.md`](./deploy/README.md).

---

## Проекты

### 1. Agios (`agios/`)

**Taverna Agios Epiktitos** — семейная кипрская таверна.

- Меню (блюда, категории, мезе-сеты, теги), заказы, бронь столика
- Уведомления заказов (Telegram)
- Языки: **EL / EN**
- Сайт: `agios.soshallitbe.cyou`

### 2. Dastorkon (`dastorkon/`)

**Dastorkon** — ресторан с онлайн-меню и заказами.

- Каталог блюд, комбо-сеты, теги, обработка заказов
- Интеграция с Telegram
- Языки: **RU / KY / EN**
- Сайт: `dastorkon.soshallitbe.cyou`

### 3. Karagat (`karagat/`)

**Отель «Карагат»** — гостиница в Караколе (Кыргызстан), горы и Иссык-Куль.

- Номера, бронирование, витрина (about / gallery / location)
- Конференс-пристройка; кухня по принципу «без меню»
- Языки: **EN / RU / KY**
- Сайт: `karagat.soshallitbe.cyou`

### 4. La Maison Fleurie (`lamaison/`)

**La Maison Fleurie** — французский ресторан в Лимассоле (Кипр).

- Публичный сайт + CMS: меню, переводы, медиа, контакты
- Без брони столиков и отельной логики (v1)
- Языки: **EN / EL**
- Сайт: `lamaison.soshallitbe.cyou`

### 5. Leondiana (`leondiana/`)

**Leondiana** — бутик-отель в Ларнаке (Кипр).

- Номера, галерея, локация, форма брони с расчётом цены и промокодами
- Админка: комнаты, брони, скидки, переводы, медиа
- Языки: **EN / ES**
- Сайт: `leondiana.soshallitbe.cyou`

---

## Структура

```
main-deploy/
├── agios/ dastorkon/ karagat/ lamaison/ leondiana/   # сайты
├── deploy/                                           # nginx, pm2, systemd, rsync
├── docs/adr/                                         # решения по хостингу
├── CONTEXT.md                                        # язык ops-контекста
└── CONTEXT-MAP.md                                    # карта контекстов
```

## Типы продуктов

| Тип | Проекты | Фокус |
|-----|---------|--------|
| Ресторан (меню + заказы) | Agios, Dastorkon | каталог, заказы, (у Agios — бронь стола) |
| Ресторан (витрина + CMS) | La Maison | меню и контент, без заказов/брони |
| Отель | Karagat, Leondiana | номера, брони, контент |
