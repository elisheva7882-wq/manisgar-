# BeSmachot Server

ASP.NET Core Web API for the BeSmachot React project.

## Stack
- .NET 9 / ASP.NET Core
- Entity Framework Core 9
- PostgreSQL via Docker
- JWT authentication

## Local setup

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
2. Restore packages:
   ```bash
   dotnet restore
   ```
3. Install EF CLI if needed:
   ```bash
   dotnet tool install --global dotnet-ef --version 9.0.21
   ```
4. Create the first migration:
   ```bash
   dotnet ef migrations add InitialCreate
   ```
5. Apply it to the Docker database:
   ```bash
   dotnet ef database update
   ```
6. Run the API:
   ```bash
   dotnet run
   ```

Default HTTP address: `http://localhost:5095`.

## Permissions
- `Member`: view group data, view weddings/statistics, send blessings.
- `Contributor`: Member permissions + add brides.
- `Admin`: Contributor permissions + edit/delete brides, link a bride to a registered user, change member roles, rotate join code.

## Important model choice
A `Bride` does not require a `User`. This allows brides to appear in the group even if they never registered. An admin can later link a bride record to a group member using `LinkedUserId`; only then can that user read blessings sent to her.

## React integration
Use the JWT returned by `/api/auth/register` or `/api/auth/login` as:
`Authorization: Bearer <token>`.
The development CORS policy currently allows `http://localhost:5173`.

## React compatibility
`Bride.id` is an integer (matching the current React demo), and bride status is sent/accepted as Hebrew: `מאורסת` / `נשואה`. Wedding dates use `YYYY-MM-DD`.

## Group-managed classes and specializations
Each group now owns its own class and specialization lists. Only Admins can add or delete options; all group members can read them. Contributors/Admins adding brides must select values that already exist for that group.

Endpoints:
- GET/POST `/api/groups/{groupId}/classes`
- DELETE `/api/groups/{groupId}/classes/{classId}`
- GET/POST `/api/groups/{groupId}/specializations`
- DELETE `/api/groups/{groupId}/specializations/{specializationId}`

After updating an existing development database, create and apply a migration:
`dotnet ef migrations add AddGroupClassesAndSpecializations`
`dotnet ef database update`
