shared schema with a tenant ID column

All tenants’ data (users, notes, etc.) is stored in the same MongoDB collections.

Each document includes a tenantId (reference to the tenant) to strictly isolate data between tenants.

All queries and operations filter by tenantId to ensure no cross-tenant access.

This approach simplifies database management, supports efficient indexing, and scales well.

Tenant context flows naturally in user documents and API requests via JWT tokens that include the tenant ID.

