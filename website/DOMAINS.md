# Domain-Driven Architecture

This project follows a domain-driven architecture pattern that organizes code by business domains rather than technical layers. This approach promotes better maintainability, testability, and scalability.

## Directory Structure

```
domains/
├── tech/             # Technology domain
│   ├── index.ts      # Main exports
│   ├── tech.types.ts # Domain-specific types
│   ├── tech.repository.ts # Data access
│   ├── tech.service.ts    # Business logic
│   └── tech.hooks.ts      # React hooks
│
├── project/          # Project domain
│   ├── index.ts
│   ├── project.types.ts
│   ├── project.repository.ts
│   ├── project.service.ts
│   └── project.hooks.ts
│
└── respect/          # Respect domain (for paying respects to dead tech)
    ├── index.ts
    ├── respect.types.ts
    ├── respect.repository.ts
    ├── respect.service.ts
    └── respect.hooks.ts
```

## Architecture Layers

Each domain follows a consistent architecture with separate layers of responsibility:

### 1. Types Layer

**Purpose**: Define the data structures and types used throughout the domain.

```typescript
// Example from tech.types.ts
export interface TechWithScore extends Tech {
  latest_score: number | null;
  latest_snapshot_date: string | null;
  respect_count: number;
  project_count: number;
}
```

### 2. Repository Layer

**Purpose**: Handle data access and persistence. This is the only layer that should directly communicate with data sources.

```typescript
// Example from tech.repository.ts
static async getTechById(id: string): Promise<Tech | null> {
  try {
    const { data, error } = await supabase
      .from('tech_registry')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    // Error handling...
  }
}
```

### 3. Service Layer

**Purpose**: Implement business logic and orchestrate repositories. Services should have no UI or data access concerns.

```typescript
// Example from tech.service.ts
static async getAllTechs(): Promise<TechWithScore[]> {
  const techs = await TechRepository.getAllTechs();

  // Transform and enhance with business logic
  const techsWithScores = await Promise.all(
    techs.map(async (tech) => {
      // Implementation details...
    })
  );

  // Apply business rules (sorting)
  return techsWithScores.sort((a, b) => { /* Sorting logic */ });
}
```

### 4. Hooks Layer

**Purpose**: Provide React hooks for client-side data fetching and state management.

```typescript
// Example from tech.hooks.ts
export function useAllTechs() {
  const [techs, setTechs] = useState<TechWithScore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementation details...
  }, []);

  return { techs, isLoading, error };
}
```

## API Layer

The API routes in `/app/api` leverage the service layer to provide HTTP endpoints:

```typescript
// Example API route
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Parse parameters...

    const result = await SomeService.someMethod(params);

    return NextResponse.json(result);
  } catch (error) {
    const { statusCode, body } = await apiErrorHandler(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
```

## Shared Infrastructure

Shared utilities and infrastructure live in the `/lib` directory:

```
lib/
├── api/           # API clients and utilities
│   └── client.ts  # Fetch wrapper with interceptors
├── config.ts      # Application configuration
├── errors.ts      # Error handling system
├── supabase.ts    # Supabase client
└── utils.ts       # Shared utilities
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a clear responsibility.
2. **Testability**: Business logic (services) can be tested without UI or database dependencies.
3. **Scalability**: Domains can evolve independently.
4. **Maintainability**: Code is organized by business domains rather than technical layers.
5. **Discoverability**: New developers can quickly understand the codebase structure.
6. **Reusability**: Business logic can be reused across multiple UI components.
