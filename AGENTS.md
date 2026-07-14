# AGENTS.md - Vibecut Night Build

## Стек
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database + Storage)
- Inngest (pipeline)

## Структура проекта
- `app/` — App Router pages and routes
- `components/` — UI components
- `lib/` — Supabase client, utils, types
- `inngest/` — Pipeline functions (заглушки)
- `supabase/` — migrations and schema

## Правила
- RLS обязателен на всех таблицах с самого начала
- Видео хранятся приватно (signed URLs)
- Реальные секреты никогда не коммитятся
- После каждой значимой фичи — `npm run build` + `npm run lint`

## Definition of Done
- `npm run build` проходит без ошибок
- `npm run lint` проходит без ошибок
- Функционал работает как ожидается

## Границы автономности
- Можно: деплоить, менять зависимости, создавать таблицы через миграции
- Нельзя: трогать production секреты, удалять миграции

## ASSUMPTIONS
- Используем Supabase Storage вместо R2 на старте
- Google OAuth будет добавлен позже (Email-first)