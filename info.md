# Dokumentacja Projektu: Service Ticket System

Opis architektury, struktury plików, walidacji danych, obsługę delegatów i integrację API dla systemu rejestracji i weryfikacji zgłoszeń serwisowych (*Service Ticket System*). Projekt zrealizowany zgodnie z zasadami SOLID.

---

## 1. Backend – Aplikacja w C# (.NET 8 / ASP.NET Core Web API)

Aplikacja backendowa odpowiada za logikę, walidację danych, trwałość danych w formacie JSON i architekturę opartą na zdarzeniach.

### `ITicketRepository.cs`
Interfejs warstwy dostępu do danych, zapewniający abstrakcję nad fizycznym miejscem zapisu zgłoszeń i umożliwiający łatwą zamianę implementacji.
* **Metody:**
    * `Task AddAsync(ServiceTicket ticket)`: Asynchronicznie dodaje nowe zgłoszenie.
    * `Task<List<ServiceTicket>> GetAllAsync()`: Asynchronicznie pobiera kompletną listę zgłoszeń.
    * `Task<bool> UpdateAsync(ServiceTicket ticket)`: Asynchronicznie aktualizuje istniejące zgłoszenie. Zwraca `false`, jeśli obiekt nie istnieje.
    * `Task<bool> DeleteAsync(Guid id)`: Asynchronicznie usuwa zgłoszenie po identyfikatorze. Zwraca `false`, jeśli obiekt nie istnieje.

### `JsonTicketRepository.cs`
Klasa implementująca interfejs `ITicketRepository`, realizująca trwałość danych przy użyciu pliku `tickets.json`. 
* **Wykorzystanie technologii:** `System.Text.Json` do asynchronicznej serializacji i deserializacji kolekcji.
* **Parametry techniczne:** Serializacja wykorzystuje opcję `WriteIndented = true` w celu zachowania czytelności pliku.
* **Obsługa błędów wejścia/wyjścia:** W przypadku braku pliku źródłowego, metoda `GetAllAsync` zwraca zainicjalizowaną, pustą listę `List<ServiceTicket>`, zapobiegając wystąpieniu `FileNotFoundException`.

### `ServiceTicketCategories.cs`
Typ wyliczeniowy (`enum`) kategoryzujący zgłoszenia serwisowe w systemie.
* **Dostępne wartości:** `Misc` (Ogólne, inne), `Hardware` (Sprzęt), `Software` (Oprogramowanie), `Network` (Sieć).

### `ServiceTicket.cs`
Klasa modelu danych reprezentująca pojedyncze zgłoszenie serwisowe wraz z regułami walidacji `DataAnnotations`.
* **Właściwości i reguły walidacji:**
    * `Id` (`Guid`): Unikalny identyfikator systemowy zgłoszenia. Automatycznie inicjalizowany wartością `Guid.NewGuid()`.
    * `FullName` (`string`): Imię i nazwisko zgłaszającego. Pole wymagane (`[Required]`), minimalna długość: 2 znaki (`[MinLength(2)]`).
    * `Email` (`string`): Adres e-mail kontaktu. Pole wymagane (`[Required]`), sprawdzane pod kątem profesjonalnej struktury adresu e-mail (`[EmailAddress]`).
    * `Description` (`string`): Opis problemu technicznego. Pole wymagane (`[Required]`), minimalna długość: 10 znaków (`[MinLength(10)]`).
    * `Category` (`ServiceTicketCategories`): Kategoria zgłoszenia. Pole wymagane (`[Required]`), domyślnie ustawione na `ServiceTicketCategories.Misc`.
    * `CreateTime` (`DateTime`): Znacznik czasu UTC utworzenia zgłoszenia. Wykorzystywany głównie do formatowania na stronie.

### `ServiceTicketValidator.cs`
Komponent odpowiedzialny za wywołanie walidacji silnika `DataAnnotations` (izolacja logiki walidacyjnej od kontrolera).
* **Metody:**
    * `bool Validate(ServiceTicket ticket, out List<ValidationResult> results)`: Dokonuje walidacji przekazanego obiektu w kontekście `ValidationContext`. Wszelkie błędy są przekazywane poprzez parametr wyjściowy `out`. Zwraca wartość `true` w przypadku pełnej zgodności z regułami.

### `Delegates.cs`
W projekcie zdefiniowano dedykowany typ delegata umożliwiający implementację wzorca edytor-subskrybent w celu asynchronicznego powiadamiania innych modułów o zdarzeniach w systemie.
* **Definicja:** `public delegate void TicketAddedHandler(ServiceTicket ticket);`

### `TicketService.cs`
Klasa warstwy zarządzająca operacjami na zgłoszeniach, pośrednicząca pomiędzy kontrolerem API a repozytorium danych. Otrzymuje instancję repozytorium poprzez wstrzykiwanie zależności (DI).
* **Zdarzenia:** Posiada publiczne zdarzenie `public event TicketAddedHandler? TicketAdded;` wywoływane w momencie poprawnego zapisania zgłoszenia.
* **Metody:**
    * `AddTicketAsync`: Zapisuje zgłoszenie w repozytorium oraz wywołuje (jeśli istnieją subskrybenci) zdarzenie `TicketAdded` metodą `.Invoke()`.
    * `GetTicketsAsync`, `UpdateTicketAsync`, `DeleteTicketAsync`: Przekazują żądania do odpowiednich metod asynchronicznych repozytorium.

### `TicketLogger.cs`
Klasa pomocnicza symulująca system logowania zdarzeń.
* **Metody:**
    * `Log(ServiceTicket ticket)`: Wypisuje w konsoli systemowej informację o dodaniu nowego zgłoszenia wraz z jego unikalnym identyfikatorem. Podpinana jako subskrybent pod zdarzenie `TicketAdded`.

### `EmailNotifier.cs`
Klasa pomocnicza symulująca zewnętrzny system powiadomień.
* **Metody:**
    * `Send(ServiceTicket ticket)`: Generuje w konsoli potwierdzenie wysłania wiadomości e-mail na adres podany w zgłoszeniu. Podpinana jako subskrybent pod zdarzenie `TicketAdded`.

### `TicketsController.cs`
Kontroler REST API udostępniający operacje CRUD na zgłoszeniach serwisowych poprzez protokół HTTP. Wszystkie akcje są zabezpieczone blokami `try-catch` i zwracają odpowiednie kody statusowe HTTP w przypadku błędów (kod 500).
* **Endpointy:**
    * `GET /api/tickets/{id}`: Pobiera jedno zgłoszenie. Jeśli nie istnieje, zwraca `404 NotFound`.
    * `GET /api/tickets`: Pobiera listę wszystkich zgłoszeń (`200 Ok`).
    * `POST /api/tickets`: Tworzy nowe zgłoszenie. Wywołuje jawną walidację poprzez `ServiceTicketValidator`. Jeśli dane są niepoprawne, przesyła listę błędów wraz ze statusem `400 BadRequest`. Nadpisuje kluczowe pola bezpieczeństwa (`Id` na nowy GUID, `CreateTime` na aktualny czas UTC) i uruchamia potok zdarzeń w `TicketService`.
    * `PUT /api/tickets/{id}`: Aktualizuje dane istniejącego zgłoszenia. Wymaga ponownej walidacji obiektu. Zwraca `404` w przypadku braku rekordu.
    * `DELETE /api/tickets/{id}`: Usuwa zgłoszenie z systemu. Zwraca status `244 NoContent` po pomyślnym usunięciu.

### `Program.cs`
Punkt wejściowy aplikacji. Odpowiada za konfigurację kontenera IoC/DI, konfigurację CORS, rejestrację potoku Middleware oraz podpięcie delegatów.
* **Konfiguracja usług (DI):**
    * Rejestracja `JsonTicketRepository` jako `ITicketRepository` w trybie `Singleton`.
    * Rejestracja `TicketService` oraz `ServiceTicketValidator` jako `Singleton`.
    * Konfiguracja kontrolerów wraz z `JsonStringEnumConverter`, co zapewnia mapowanie wartości enum na czytelne ciągi tekstowe w formatach wejściowych/wyjściowych JSON.
* **Polityka CORS:** Zdefiniowano regułę `AllowReact` zezwalającą na pełną komunikację HTTP (metody, nagłówki) dla aplikacji frontendowej uruchomionej pod adresem `http://localhost:5173`.
* **Swagger/OpenAPI:** Integracja narzędzia dokumentującego endpoints.
* **Inicjalizacja mechanizmu zdarzeń:** Po zbudowaniu aplikacji (`builder.Build()`), instancje `TicketLogger` i `EmailNotifier` są subskrybowane pod zdarzenie `TicketAdded` instancji `TicketService` pobranej z kontenera aplikacji:
    ```csharp
    service.TicketAdded += logger.Log;
    service.TicketAdded += notifier.Send;
    ```
* **Deklaracja klasy częściowej:** `public partial class Program { }` umożliwia poprawne odniesienie się do klasy wejściowej w testach integracyjnych z użyciem `WebApplicationFactory`.

---

## 2. Testy Jednostkowe i Integracyjne – Projekt Testowy MSTest

Projekt testowy zapewnia weryfikację poprawności biznesowej oraz integralności interfejsów API systemu zgłoszeń.

### `ServiceTicketTests.cs`
Klasa zawierająca testy jednostkowe kluczowych komponentów systemu.
* **Przetestowane przypadki:**
    * `Should_Return_False_When_Ticket_Data_Is_Invalid`: Weryfikacja działania `ServiceTicketValidator`. Sprawdza, czy niespełnienie kryteriów (zbyt krótkie imię, niepoprawny e-mail, zbyt krótki opis) skutkuje zwróceniem `false` i wygenerowaniem obiektów błędu `ValidationResult`.
    * `Should_Return_True_When_Ticket_Data_Is_Valid`: Sprawdza, czy poprawnie wypełniony obiekt przechodzi proces walidacji bez błędów.
    * `Should_Invoke_TicketAdded_Event_When_Added_Through_Service`: Test jednostkowy mechanizmu delegatów. Weryfikuje, czy wywołanie metody `AddTicketAsync` poprawnie podnosi zdarzenie `TicketAdded` i wykonuje zarejestrowane funkcje zwrotne.
    * `Should_Serialize_And_Deserialize_Ticket_Correctly`: Sprawdza zachowanie serializatora JSON oraz poprawne działanie konwertera typów wyliczeniowych (`JsonStringEnumConverter`).

### `TicketsApiIntegrationTests.cs`
Klasa realizująca testy integracyjne endpoints API w pamięci przy użyciu komponentu `WebApplicationFactory<Program>`.
* **Przetestowane przypadki:**
    * `Get_Tickets_Endpoint_Should_Return_Success_Status_Code`: Testuje zapytanie HTTP GET na endpoint `/api/tickets`. Weryfikuje poprawność kodu statusu (seria 2xx) oraz obecność nagłówka odpowiedzi o typie `application/json`.
    * `Create_Valid_Ticket_Should_Return_Ok_With_New_Id`: Symuluje żądanie HTTP POST z poprawnym ładunkiem JSON zgłoszenia. Test sprawdza, czy serwer zwraca status powodzenia oraz czy struktura odpowiedzi zawiera poprawnie nadany, niepusty identyfikator `Guid`.

---

## 3. Frontend – React + Tailwind CSS

Warstwa prezentacji komunikuje się asynchronicznie z backendem i przetwarza odpowiedzi serwera w celu dynamicznej aktualizacji interfejsu użytkownika.

### `api.js` (Lokalizacja: `src/utils/api.js`)
Moduł odpowiedzialny za izolację warstwy sieciowej (wywołania HTTP Fetch) od komponentów widoku React.
* **Stałe konfiguracyjne:**
    * `API_PORT = "5008"`
    * `BASE_URL = http://localhost:5008/api/tickets`
* **Definiowane funkcje asynchroniczne:**
    * `getTickets()`: Pobiera listę wszystkich zgłoszeń w formacie JSON z API. Rzuca wyjątek w przypadku błędu sieciowego.
    * `getTicketById(id)`: Pobiera szczegółowe informacje o wybranym zgłoszeniu na podstawie parametru identyfikatora.
    * `createTicket(ticketData)`: Przesyła dane nowego zgłoszenia metodą POST. W przypadku zwrócenia przez API błędu walidacji (status 400), parsuje i przekazuje strukturę błędów bezpośrednio do komponentu formularza.
    * `updateTicket(id, ticketData)`: Aktualizuje zgłoszenie przy użyciu żądania PUT.
    * `deleteTicket(id)`: Usuwa zgłoszenie przy użyciu metody DELETE. Zwraca wartość `true` w przypadku sukcesu.

---

## 4. Specyfikacja Techniczna Interfejsu REST API

### Format Obiektu wejściowego / wyjściowego (JSON)
```json
{
    "id": "56920084-60f5-43d4-839d-1f3018096a7d",
    "fullName": "John John",
    "email": "jan.janjan@example.com",
    "description": "Problem z połączeniem sieciowym w pokoju 246",
    "category": "Network",
    "createTime": "2026-06-07T07:15:00Z"
}