# Teststrategie Filament Swatch Manager

## Was testen wir?

Die Web-App verwalten Filamente mit CRUD, Filter, Sortierung und Supabase-DB. Ziel: Alles funktioniert zuverlässig.

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

### E2E Tests (Browser)

- Filter setzen/löschen → Karten aktualisieren
- Sortieren (Spalte/Richtung) → Reihenfolge ändert
- Formular ausfüllen → neues Filament erscheint
- URL-Filter persistent bei Reload

## Tools & Setup

- Unit: Jest + React Testing Library
- API-Mock: MSW
- E2E: Playwright
- DB: Supabase Testprojekt
- CI: GitHub Actions (jeder Push/PR)

## Coverage-Ziele

- utils.ts: 90%
- API: 80%
- Frontend: 70%
- Gesamt: 75%
