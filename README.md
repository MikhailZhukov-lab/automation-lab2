# Лабораторна робота № 7

Жуков Михайло Володимирович. Варіант 1.
Складні сценарії взаємодії з інтерфейсом. TypeScript + Playwright + Chromium.

## Запуск у PowerShell

На цьому комп’ютері спочатку відкрий папку проєкту:

```powershell
cd D:\LABS\TEST7 # Перейти до лабораторної роботи
```

Для першого запуску після завантаження проєкту:

```powershell
npm.cmd ci # Встановити точні версії залежностей із package-lock.json
npx.cmd playwright install chromium # Завантажити браузер для тестів
```

`npm.cmd` обходить обмеження запуску npm.ps1 у PowerShell без зміни політики системи.
Потрібен установлений Node.js із npm. Проєкт перевірено на Node.js 24.14.0.

### Основні команди

Виконуй потрібну команду окремо:

```powershell
npm.cmd test # Запустити всі 17 тестів і сформувати HTML- та JSON-звіти
npm.cmd run test:ui # Відкрити графічний режим для запуску й перегляду кроків тестів
npm.cmd run report # Відкрити HTML-звіт останнього звичайного прогону
npm.cmd run typecheck # Перевірити типи TypeScript без запуску браузера
```

У графічному режимі натисни трикутник запуску біля потрібного тесту або всього набору.
Для актуального HTML-звіту спочатку виконай `npm.cmd test`, потім `npm.cmd run report`.
Щоб зупинити UI або сервер звіту, повернися в термінал і натисни `Ctrl+C`.

### Запуск окремих груп

```powershell
npx.cmd playwright test tests/forms.spec.ts # Список, прапорці та повзунок
npx.cmd playwright test tests/tables.spec.ts # Рядки таблиці, пошук, сортування та сума
npx.cmd playwright test tests/dialogs.spec.ts # Alert, confirm і prompt
npx.cmd playwright test tests/files.spec.ts # Вивантаження та завантаження файлів
npx.cmd playwright test tests/windows-frames.spec.ts # Нова вкладка та редактор у фреймі
npx.cmd playwright test tests/dynamic.spec.ts # Очікування динамічного вмісту
npx.cmd playwright test tests/variant1.spec.ts # Обидва тести індивідуального варіанта 1
```

### Демонстрація та налагодження

```powershell
npx.cmd playwright test --headed # Виконати весь набір із видимими вікнами браузера
npx.cmd playwright test tests/variant1.spec.ts --headed --workers=1 # Послідовно показати варіант 1 у браузері
npx.cmd playwright test tests/variant1.spec.ts --ui # Відкрити UI лише для варіанта 1
npx.cmd playwright test -g "V1:" # Запустити тільки тест додавання п’яти елементів
npx.cmd playwright test -g "V2:" # Запустити тільки тест видалення двох елементів
npx.cmd playwright test tests/variant1.spec.ts --debug # Відкрити Playwright Inspector для покрокового налагодження
npx.cmd playwright test --list # Показати список тестів без їх виконання
```

Звичайний запуск окремого тесту також оновлює звіти: після нього вони міститимуть результати лише вибраного набору.

Щоб зберегти журнал повного прогону для формування звіту:

```powershell
New-Item -ItemType Directory -Force artifacts | Out-Null # Створити папку результатів
cmd /c "npm.cmd test > artifacts\test-run.txt 2>&1" # Виконати весь набір і зберегти вивід у файл
Get-Content artifacts\test-run.txt -Encoding UTF8 # Переглянути збережений журнал
```

Під час цього запуску вивід записується у файл; дочекайся повернення запрошення термінала.

### Інша адреса стенду

Типова адреса: https://the-internet.herokuapp.com. Якщо викладач надасть іншу адресу, встанови її для поточної сесії PowerShell:

```powershell
$env:BASE_URL = 'http://localhost:3000' # Приклад адреси; заміни на фактичну адресу готового стенду
npm.cmd test # Запустити перевірки проти вибраного стенду
Remove-Item Env:BASE_URL # Повернути використання стандартної адреси
```

Ці команди не запускають локальний стенд: він має бути доступний окремо.

17 незалежних тестів: 15 обов’язкових і 2 для варіанта 1.
Тести виконуються без явних пауз та без повторних спроб, у двох workers.
HTML-звіт: `playwright-report/index.html`; машинні результати: `artifacts/results.json`.
Завантажені файли зберігаються в окремих каталогах `test-results`.

## Уточнення методички

- Фактична сума Due у table1: 50 + 51 + 100 + 50 = 251,00. Значення 203,00 у прикладі помилкове.
- Повзунок спочатку отримує фокус і клавішу Home. Натискання посередині змінює його значення.
- Посилання завантаження обмежене `.example a[href^="download/"]`, щоб не натиснути зовнішнє посилання.
- Кирилиця у фреймі вводиться через fill(); перевіряється доступність редактора без зміни DOM.
- Очікування сортування та суми виконане через expect.poll().

Репозиторій: [automation-lab2, гілка 7](https://github.com/MikhailZhukov-lab/automation-lab2/tree/7).

Для завантаження цієї гілки на іншому комп’ютері:

```powershell
git clone --branch 7 --single-branch https://github.com/MikhailZhukov-lab/automation-lab2.git automation-lab7 # Завантажити лабораторну № 7
cd automation-lab7 # Відкрити папку завантаженого проєкту
npm.cmd ci # Встановити залежності
npx.cmd playwright install chromium # Установити Chromium
npm.cmd run test:ui # Відкрити графічний режим
```

