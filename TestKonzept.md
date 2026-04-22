# Teststrategie Filament Swatch Manager

## Was testen wir?

Die Web-App verwaltet Filamente mit CRUD (ohne Update/Delete), Filter, Sortierung und Supabase-DB. Ziel: Alles funktioniert zuverlässig.

## Testarten

- 60% Unit Tests (Jest): Pure Funktionen
- 30% Integration (MSW): API + Frontend
- 10% E2E (Playwright): Komplette Userflows

## Wichtige Testfälle

### Unit Tests

- Filter: Material, Farbe, Lagerstatus, Mehrfachfilter
- Sortierung: Zahlen, Datum, Strings, null-Werte
- Dropdown-Counts (generateKeyCountPairs)

### Integration Tests (API-Routes)

- GET /api/filament → Liste laden
- POST neues Filament → erfolgreich erstellt
- POST fehlerhaft → 400/409 Fehler
- Supabase-Ausfall → 500 Fehler

- Validierung:
  - Pflichtfelder fehlen → Fehler
  - Ungültige Werte → Fehler

- UI-Verhalten:
  - Loading State während Request
  - Empty State bei leerer Liste

### E2E Tests (Browser)

- Filter setzen/löschen → Karten aktualisieren
- Sortieren (Spalte/Richtung) → Reihenfolge ändert
- Formular ausfüllen → neues Filament erscheint
- Formular mit Fehlern → Fehlermeldungen sichtbar
- URL-Filter persistent bei Reload
- Direktaufruf mit URL-Parametern → Filter korrekt gesetzt
- Empty State sichtbar, wenn keine Daten vorhanden

## Tools & Setup

- Unit: Jest + React Testing Library
- API-Mock: MSW
- E2E: Playwright
- DB: Supabase Testprojekt

### Testdaten

- Definierte Seed-Daten für Tests
- Konsistenter DB-Zustand pro Testlauf (Reset oder Isolation)

## Coverage-Ziele

- utils.ts: 90%
- API: 80%
- Frontend: 70%
- Gesamt: 75%

## Umgesetzt (April 2026)

### Framework Setup

- Jest + React Testing Library konfiguriert (`jest.config.ts`, `jest.setup.ts`)
- MSW für Integrationstests eingerichtet (MSW v1 in Jest-Tests)
- Playwright konfiguriert (`playwright.config.ts`)
- NPM-Skripte ergänzt:
  - `npm run test`
  - `npm run test:watch`
  - `npm run test:coverage`
  - `npm run test:e2e`
  - `npm run test:e2e:ui`

### Umgesetzte Tests

- Unit:
  - `src/lib/utils.test.ts`
  - `src/lib/filamentQuery.test.ts`
- Integration:
  - `src/app/api/filament/route.test.ts`
  - `src/lib/filamentCrud.integration.test.ts`
  - `src/app/home.integration.test.tsx`
- E2E:
  - `tests/e2e/home.spec.ts`

### Ergänzte App-Logik für Testbarkeit

- Filter/Sortierung aus `page.tsx` extrahiert nach `src/lib/filamentQuery.ts`
- API-Validierung für `POST /api/filament` ergänzt (400 bei invalidem Payload)
- 409 für Duplikate (`identifier`) ergänzt
- Empty State in der Home-Ansicht ergänzt (`No filaments found.`)
