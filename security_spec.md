# Security Specification - Actor Portfolio

## 1. Data Invariants
- `Profile` (path: `profile/main`) is a singleton document.
- `Works`, `Testimonials`, and `Assets` are read-only for public visitors.
- Only the authenticated administrator can create, update, or delete content.
- Timestamps must be server-generated.
- String fields must have size limits to prevent abuse.

## 2. The Dirty Dozen Payloads (Targeting /works/{workId})
1. **Unauthenticated Write:** Attempt to create a work without being signed in.
2. **Identity Spoofing:** Signed-in user (not admin) attempting to update a work.
3. **Invalid Type:** Sending a number for the `title` field.
4. **Large Payload:** Sending a 2MB string for `characterDescription`.
5. **HTML Injection:** Sending `<script>` as part of the `title`. (Handled by client, but rules should restrict size).
6. **Hidden Field Injection:** Sending `isAdmin: true` in a profile update.
7. **Orphaned Write:** Creating a work with a future timestamp (not using server timestamp).
8. **Resource Exhaustion:** Creating 10,000 work documents (Rules can't fully prevent this without rate limiting, but we can restrict ID formats).
9. **Invalid ID:** Using a 2KB string as a document ID.
10. **Schema Bypass:** Omitting required fields like `title`.
11. **PII Leak:** Attempting to read a hypothetical `private_notes` collection.
12. **State Corruption:** Changing the `order` of a work to a negative number.

## 3. Test Runner (Draft)
A conceptual test suite that verifies these payloads are rejected by the rules.
