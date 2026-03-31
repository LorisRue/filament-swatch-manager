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
