rootProject.name = "DAT251_CarPooling"

// Composite build: keeps `carpooling-backend/` fully standalone while allowing the repo root
// to be opened/imported as a Gradle project (e.g. in IntelliJ).
includeBuild("carpooling-backend")
