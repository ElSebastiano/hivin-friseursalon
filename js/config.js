/**
 * Zentrale Konfiguration – hier Zugangsdaten eintragen, sobald vorhanden.
 * Diese Datei enthält bewusst keine echten Schlüssel (siehe phase1_analyse.md
 * / phase4-Dokumentation zu offenen Fragen).
 */
window.HIVIN_CONFIG = {
  // Google Maps JavaScript API Key eintragen, um die vollständig interaktive,
  // individuell gestaltete Karte zu aktivieren. Ohne Key wird automatisch der
  // schlüssellose Google-Maps-iFrame-Fallback (ebenfalls interaktiv: zoom-/
  // schwenkbar) angezeigt.
  GOOGLE_MAPS_API_KEY: "YOUR_GOOGLE_MAPS_API_KEY",

  // Google-Maps-Referenz (siehe Akquise-Datei & Phase 1). Für die Variante mit
  // API-Key wird die Adresse serverseitig/clientseitig per Geocoding-Service
  // aufgelöst – es werden bewusst keine ungeprüften Koordinaten hinterlegt.
  MAPS_CID_URL: "https://maps.google.com/?cid=14759134277047685286",
  MAPS_QUERY: "Hivin Friseursalon, Industriestraße 26, 78224 Singen (Hohentwiel)",

  // Calendly-Terminlink eintragen (z. B. https://calendly.com/hivin-friseursalon/termin).
  // Solange der Platzhalter unverändert bleibt, zeigt die Seite eine
  // Terminanfrage-Karte mit Telefonnummer statt eines defekten Widgets.
  CALENDLY_URL: "https://calendly.com/YOUR-CALENDLY-LINK"
};
