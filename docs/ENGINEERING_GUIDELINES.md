# Permanent Engineering Guidelines

This document governs all future implementations, features, and iterations for the FoneBox Enterprise CRM platform. Strict adherence to these principles is mandatory.

## 1. Architectural Integrity & Extension
1. **Never refactor completed iterations** (Prompt 1 and Prompt 2) unless fixing a specifically verified bug.
2. **Maintain backward compatibility** at all times.
3. **Never break Prompt 1 or Prompt 2** foundation or architecture.
4. **Prefer extension over modification**. If an existing module can be extended to support a new feature, do not rewrite it.
5. **Preserve Git history** by minimizing unnecessary file changes.
6. **Keep modules isolated**. Avoid tight coupling between bounded contexts (e.g., CRM logic vs. Admin logic).

## 2. Design & UI Systems
1. Every new feature must follow the **existing design system**.
2. Every new page must use **reusable shared components**.
3. **No duplicated UI components**. Use `@/components/ui` libraries effectively.

## 3. Code Standards & Patterns
1. **No duplicated business logic**. Abstract logic into services or utilities.
2. Every API must use the **standardized response format** (`{ success, data, message, error }`).
3. Follow **SOLID principles**.
4. Follow **Clean Architecture**.
5. Follow **DRY** (Don't Repeat Yourself).
6. Follow **KISS** (Keep It Simple, Stupid).
7. Follow **Separation of Concerns**.

## 4. Mandatory Release Workflow
Every future iteration (Prompt 3 onward) MUST automatically undergo the following checklist upon implementation:

- [ ] Pass `npm run lint`
- [ ] Pass `npm run build`
- [ ] Pass TypeScript compilation (`npm run typecheck`)
- [ ] Update `CHANGELOG.md` with the new prompt/iteration
- [ ] Update `docs/PROJECT_STATUS.md`
- [ ] Create a Git commit using the format: `feat(prompt-X): <iteration summary>`
- [ ] Create a Git tag: `prompt-X` (where X is the prompt number)
- [ ] Push commits and tags to the remote if an authenticated remote exists (`git push origin`, `git push origin --tags`)
