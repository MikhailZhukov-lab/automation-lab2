# Лабораторна робота 6 — Playwright

Автоматизовані UI-тести для сайту [SauceDemo](https://www.saucedemo.com). Перевіряються вхід до системи, каталог товарів, сортування та кошик. Основні тести запускаються у Chromium і Firefox; діагностичний сценарій — у Chromium.

## Встановлення

Потрібен Node.js. У корені проєкту виконайте:

```bash
npm ci
npm run install:browsers
```

## Запуск тестів

```bash
npm test
```

Запустити тести лише у Chromium:

```bash
npx playwright test --project=chromium
```

Запустити окремий сценарій варіанта 1 (сортування за спаданням цін):

```bash
npm run test:variant1
```

Запустити діагностичні тести:

```bash
npm run test:lab6:diagnostic
```

## Звіти

Після запуску тестів HTML-звіт можна відкрити командою:

```bash
npm run report
```

Діагностичний звіт:

```bash
npm run report:diagnostic
```

Звіти, результати тестів і встановлені залежності виключені з Git.
