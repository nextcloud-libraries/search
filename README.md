# @nextcloud/search

Unified search helpers for Nextcloud apps and libraries.

## Installation

```bash
npm install @nextcloud/search
```

## Usage

### FilterBuilder

Build search filters with a fluent API:

```typescript
import { FilterBuilder } from '@nextcloud/search'

const filters = new FilterBuilder()
  .term('quarterly report')
  .thisMonth()
  .user('admin')
  .build()

// Serialize for API requests
const params = filters.toQueryParams()
// { term: 'quarterly report', since: '2025-01-01T...', until: '2025-01-31T...', person: 'user:admin' }
```

### Date Range Helpers

```typescript
const filters = new FilterBuilder()
  .term('meeting notes')
  .today()           // From start of today
  // .thisWeek()     // From start of current week (Monday)
  // .thisMonth()    // From start of current month
  // .thisYear()     // From start of current year
  // .lastDays(7)    // Last 7 days
  // .dateRange({ since: new Date('2025-01-01'), until: new Date('2025-06-30') })
  .build()
```

### FilterCollection

Work with immutable filter collections:

```typescript
import { FilterCollection } from '@nextcloud/search'

// Parse from URL query parameters
const definitions = new Map([
  ['term', { type: 'string' }],
  ['since', { type: 'datetime' }],
  ['person', { type: 'person' }],
])

const collection = FilterCollection.fromQueryParams(
  { term: 'report', since: '2025-01-01T00:00:00.000Z' },
  definitions
)

// Access typed values
const term = collection.getTerm()           // 'report'
const dateRange = collection.getDateRange() // { since: Date, until?: Date }
const person = collection.getPerson()       // { type: 'user', id: 'admin' } | null

// Immutable updates
const updated = collection
  .with('person', { name: 'person', type: 'person', value: { type: 'user', id: 'alice' } })
  .without('since')
```

### Types

```typescript
import type {
  Filter,
  FilterDefinition,
  DateRange,
  PersonValue,
  SearchQuery,
  SearchResultEntry,
  ProviderInfo,
} from '@nextcloud/search'
```

## Development

```bash
npm install
npm test
npm run build
```

## License

AGPL-3.0-or-later
