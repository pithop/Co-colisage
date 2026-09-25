---
name: frontend-design
description: >-
  Frontend architectural guidelines for modern high-performance web applications.
  Focuses on modular components, clean state management, accessible markup, and responsive design.
---

# Frontend Design Standards

## 1. Component Modularity & Clean Architecture
- Atomic structure: UI primitives (Buttons, Badges, Modals, Inputs) vs Composite modules (Hero, ProductCard, EscrowFlow, PINModal).
- Single source of truth for mock data and state transitions (e.g. active tab, active filters, selected product, upload status).

## 2. Responsive Mastery
- Mobile-first CSS foundation, scaling gracefully to tablet, laptop, and ultra-wide XXL desktop (1440px+).
- Support device preview framing (toggleable iPhone simulation vs full viewport) for executive presentations.
