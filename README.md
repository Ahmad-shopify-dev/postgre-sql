# PostgreSQL + Prisma — 7 Day Quick Learning Plan

## Day 1 — PostgreSQL Basics

* Database / Tables / Rows / Columns
* Data Types
* Primary Key
* Foreign Key
* Constraints
* `CREATE`
* `ALTER`
* `DROP`

## Day 2 — SQL CRUD

* `SELECT`
* `INSERT`
* `UPDATE`
* `DELETE`
* `WHERE`
* `ORDER BY`
* `LIMIT / OFFSET`
* `LIKE`
* `IN`
* `BETWEEN`

## Day 3 — Relationships & Queries

* 1-to-1
* 1-to-many
* Many-to-many
* `INNER JOIN`
* `LEFT JOIN`
* `GROUP BY`
* `COUNT`
* `SUM`
* `AVG`
* Basic Subqueries

## Day 4 — Important PostgreSQL Concepts

* Indexes
* Unique Constraints
* `NULL`
* Transactions / ACID
* Basic Normalization
* `EXPLAIN` — Basic Understanding

## Day 5 — Prisma Core

* Prisma Setup
* `schema.prisma`
* Models
* Fields & Types
* Relations
* Prisma Client
* `prisma generate`
* Migrations

## Day 6 — Prisma CRUD & Relations

* `create`
* `findUnique`
* `findMany`
* `update`
* `delete`
* Filtering
* Sorting
* Pagination
* `include`
* `select`
* Nested Create / Update
* Relations

## Day 7 — Production Concepts

* `$transaction`
* `createMany`
* `updateMany`
* `deleteMany`
* Seed Data
* Migration Workflow
* Raw SQL — When to Use
* N+1 Problem
* Indexes & Query Performance

### Mini Project

Build a small e-commerce database:

```text
Users
  ↓
Orders
  ↓
OrderItems
  ↓
Products
```

Implement:
* User CRUD
* Product CRUD
* Create Order
* Add Order Items
* Product/User relationships
* Order history
* Pagination
* Transactions
* Proper migrations

## 🎯 Final Goal

**PostgreSQL:** Understand databases + write SQL confidently.

**Prisma:** Use PostgreSQL professionally inside a Node.js/Next.js application.

> Don't go deep into advanced PostgreSQL yet. Learn the fundamentals, build the mini project, and learn advanced concepts when a real project requires them.
