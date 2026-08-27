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


**PostgreSQL:** Understand databases + write SQL confidently.
**Prisma:** Use PostgreSQL professionally inside a Node.js/Next.js application.
> Don't go deep into advanced PostgreSQL yet. Learn the fundamentals, build the mini project, and learn advanced concepts when a real project requires them.


Let’s walk through a step-by-step **Node.js + Prisma** project setup, covering both **Online (Cloud Database)** and **Offline (Local PostgreSQL)** connections.

---

## Step 1: Project Setup (Node.js & Prisma)

First, create a new directory and initialize a Node.js project:

```bash
# 1. Create a new directory and enter it
mkdir node-prisma-demo
cd node-prisma-demo

# 2. Initialize a Node project
npm init -y

# 3. Install Prisma CLI as a dev dependency
npm install prisma --save-dev

# 4. Install Prisma Client (Main Library)
npm install @prisma/client

```

---

## Step 2: Initialize Prisma

Run the following command to initialize Prisma:

```bash
npx prisma init

```

This command generates two new files in your project:

1. `prisma/schema.prisma` -> Defines your database structure/schema.
2. `.env` -> Stores environment variables like your database connection URL and credentials.

---

## Step 3: Database Connection Setup (Offline & Online)

When you open the `.env` file, you will find the `DATABASE_URL` variable.

### Option A: Offline / Local PostgreSQL (Running on your system)

If you are using a local instance of PostgreSQL / pgAdmin:

```env
DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"

```

* **Example:**

```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/books_db?schema=public"

```

### Option B: Online / Cloud Database (Neon / Supabase / Render)

Creating a free cloud PostgreSQL instance is very straightforward (e.g., via **Neon.tech** or **Supabase**). They provide a direct connection string to paste into your environment file.

```env
DATABASE_URL="postgresql://username:password@ep-cool-pool-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"

```

> **Pro Tip:** Prisma handles local and cloud databases identically through the connection URL string. You can switch from local to cloud instantly by updating the `DATABASE_URL` in your `.env` file!

---

## Step 4: Schema Designing (`prisma/schema.prisma`)

Open the `prisma/schema.prisma` file to define your database models (tables).

Notice how cleanly Prisma expresses SQL concepts:

```prisma
// Database Provider and Environment Variable Configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User Model (Table)
model User {
  id        Int      @id @default(autoincrement()) // Primary Key & Sequence
  email     String   @unique                       // Unique Constraint + B-Tree Index
  name      String?                                // The (?) modifier means NULLABLE
  role      Role     @default(USER)               // Custom Enum Type
  createdAt DateTime @default(now())
  
  // Relations (Foreign Key Relationship)
  posts     Post[]

  // Custom B-Tree Index
  @@index([email])
}

// Post Model
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  
  // Foreign Key Link
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// Custom Enum Type
enum Role {
  USER
  ADMIN
}

```

---

## Step 5: Run Migrations (Create SQL Tables)

Once your schema is defined, run a migration to apply the actual tables and indexes to your PostgreSQL database:

```bash
npx prisma migrate dev --name init

```

This command executes three actions behind the scenes:

1. Generates a plain SQL migration file inside the `prisma/migrations` directory.
2. Executes the SQL script against your PostgreSQL database to create tables and constraints.
3. Automatically regenerates `@prisma/client` with updated TypeScript/JavaScript types matching your schema.

---

## Step 6: Code Implementation (CRUD Operations)

Create a new file named `index.js` to test Prisma Client:

```javascript
// index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Prisma Connected!");

  // 1. CREATE: User with nested relational posts (Nested Write)
  const newUser = await prisma.user.create({
    data: {
      name: 'Usman',
      email: 'usman@example.com',
      role: 'ADMIN',
      posts: {
        create: [
          { title: 'My First Post with Prisma', published: true },
          { title: 'Prisma vs Raw SQL' }
        ]
      }
    },
    include: {
      posts: true // Returns posts alongside the created user
    }
  });
  console.log('Created User:', newUser);

  // 2. READ: Fetch users with filtering and included relations
  const users = await prisma.user.findMany({
    where: {
      email: { endsWith: '@example.com' }
    },
    include: {
      posts: true
    }
  });
  console.log('All Users:', JSON.stringify(users, null, 2));

  // 3. UPDATE: Update a single record
  const updatedUser = await prisma.user.update({
    where: { email: 'usman@example.com' },
    data: { name: 'Usman Ali' }
  });
  console.log('Updated User:', updatedUser);

  // 4. TRANSACTION: Sequential operations with guaranteed ACID compliance
  // $transaction ensures all operations succeed or roll back together
  await prisma.$transaction([
    prisma.post.update({
      where: { id: 1 },
      data: { published: true }
    }),
    prisma.user.update({
      where: { id: 1 },
      data: { role: 'USER' }
    })
  ]);
  console.log('Transaction Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    // Always disconnect client when finished
    await prisma.$disconnect();
  });

```

Run `index.js` to execute your queries:

```bash
node index.js

```

---

## Step 7: Prisma Studio (Visual GUI Tool) 🎨

Prisma includes a built-in browser-based GUI to view and edit data visually:

```bash
npx prisma studio

```

This starts a server on `http://localhost:5555`, allowing you to inspect, modify, and interact with your database records through a clean web interface.

---

### Key Takeaways & Next Topics

Now that project setup, schema design, database migrations, and core CRUD operations are clear, the next important Prisma concepts to explore include:

1. **Relationships:** (One-to-One, One-to-Many, Many-to-Many).
2. **Filtering & Pagination:** Using `take`, `skip`, and cursor-based strategies.
3. **Raw SQL Queries:** Executing custom database queries using `prisma.$queryRaw` when Prisma abstractions aren't enough.


npx prisma migrate dev --name init_schema
npx prisma generate
npx prisma studio



# Prisma Complete Reference Guide

## Core CRUD & Relations

### `create` & Nested Create

Inserts a new record along with related records in a single query.

```javascript
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    posts: {
      create: [{ title: 'First Post' }] // Nested create
    }
  }
});

```

### `findUnique`

Fetches a single record matching a primary key or `@unique` field.

```javascript
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' }
});

```

### `findMany`, Filtering & Sorting

Retrieves multiple records with conditional filters and ordering.

```javascript
const users = await prisma.user.findMany({
  where: {
    isActive: true,
    age: { gte: 18 } // Filters: gte, lte, contains, etc.
  },
  orderBy: { name: 'asc' } // Sorting
});

```

### Pagination

Slices results using `skip` (offset) and `take` (limit).

```javascript
const page = await prisma.user.findMany({
  skip: 10, // Skip first 10
  take: 5   // Limit to 5
});

```

### `include` vs `select`

* **`include`**: Fetches related models along with the main record.
* **`select`**: Returns only specified fields to minimize payload size.

```javascript
// Using include
const userWithPosts = await prisma.user.findMany({
  include: { posts: true }
});

// Using select
const userNamesOnly = await prisma.user.findMany({
  select: { id: true, name: true }
});

```

### `update` & Nested Update

Modifies a record and its nested relationships.

```javascript
const updated = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Alice Smith',
    posts: {
      updateMany: {
        where: { published: false },
        data: { published: true }
      }
    }
  }
});

```

### `delete`

Removes a record by its unique identifier.

```javascript
const deleted = await prisma.user.delete({
  where: { id: 1 }
});

```

---

## Production Concepts

### `$transaction`

Executes multiple queries in an all-or-nothing atomic batch.

```javascript
// Interactive Transaction
await prisma.$transaction(async (tx) => {
  await tx.user.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } });
  await tx.user.update({ where: { id: 2 }, data: { balance: { increment: 100 } } });
});

```

### Bulk Operations (`createMany`, `updateMany`, `deleteMany`)

Perform fast single-query batch updates on multiple rows.

```javascript
// createMany
await prisma.user.createMany({
  data: [{ name: 'Bob', email: 'bob@test.com' }, { name: 'Sam', email: 'sam@test.com' }],
  skipDuplicates: true
});

// updateMany
await prisma.user.updateMany({
  where: { age: { lt: 18 } },
  data: { isActive: false }
});

// deleteMany
await prisma.post.deleteMany({
  where: { published: false }
});

```

### Seed Data

Populates the database with initial/dummy data automatically.

```javascript
// prisma/seed.js
import { prisma } from '../src/config/prisma.js';

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@test.com' }
  });
}
main();

```

*Run command:* `npx prisma db seed` (Configure `"prisma": { "seed": "node prisma/seed.js" }` in `package.json`).

### Migration Workflow

* **Development:** `npx prisma migrate dev --name init` (Creates migration & generates client).
* **Production:** `npx prisma migrate deploy` (Applies pending migrations cleanly).

### Raw SQL (`$queryRaw` & `$executeRaw`)

Used for complex analytical queries not supported by Prisma syntax.

```javascript
// Fetch raw data
const result = await prisma.$queryRaw`SELECT count(*) FROM "User" WHERE age > 20`;

// Execute raw statement
await prisma.$executeRaw`UPDATE "User" SET "isActive" = false WHERE age < 18`;

```

### N+1 Problem

A performance bug where fetching $N$ records causes $N+1$ separate DB queries.

* **Prisma Solution:** Prisma automatically batches relational queries into **2 queries** using `IN` clauses when you use `include`.

### Indexes & Query Performance

Accelerates search speed on high-volume tables.

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  age   Int

  @@index([age]) // Fast lookup when querying by age
}

```


# Advanced Prisma Reference Guide

## 1. Schema Features

### Enums, Composite Keys & Special Types

Restricts allowed values, creates multi-column keys, and handles flexible data types.

```prisma
// Enum definition
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}

// Composite Primary Key (Join Table)
model PostCategory {
  postId     Int
  categoryId Int

  @@id([postId, categoryId]) // Multi-column primary key
}

// Special Types
model SystemLog {
  id       Int     @id @default(autoincrement())
  metadata Json    // Stores flexible JSON data
  price    Decimal // Stores exact monetary values
}

```

---

## 2. Advanced Relations

### One-to-One (1:1) & Self-Relations

Establishes direct 1:1 links or tables referencing themselves.

```prisma
// 1:1 Relation
model Profile {
  id     Int  @id @default(autoincrement())
  bio    String
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}

// Self-Relation (Manager / Employee)
model User {
  id        Int    @id @default(autoincrement())
  name      String
  managerId Int?
  manager   User?  @relation("UserToManager", fields: [managerId], references: [id])
  team      User[] @relation("UserToManager")
}

```

---

## 3. Relational Filtering

### `some`, `every`, `none`

Filters parent records based on conditions applied to child relations.

```javascript
// SOME: Users with at least one published post
const usersSome = await prisma.user.findMany({
  where: { posts: { some: { published: true } } }
});

// EVERY: Users where ALL posts are published
const usersEvery = await prisma.user.findMany({
  where: { posts: { every: { published: true } } }
});

// NONE: Users with NO draft posts
const usersNone = await prisma.user.findMany({
  where: { posts: { none: { published: false } } }
});

```

---

## 4. Advanced Mutations

### `connect`, `disconnect` & Atomic Operations

Links/unlinks existing records and performs direct database-level numerical calculations.

```javascript
// Connect existing record
const newPost = await prisma.post.create({
  data: {
    title: 'New Post',
    author: { connect: { id: 5 } } // Link to existing User ID 5
  }
});

// Atomic Operation (Increment/Decrement)
await prisma.user.update({
  where: { id: 1 },
  data: {
    age: { increment: 1 } // Avoids race conditions (age = age + 1)
  }
});

```

---

## 5. Relation Counts (`_count`)

Fetches relation counts without loading actual relational payloads.

```javascript
const usersWithCount = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    _count: {
      select: { posts: true } // Returns post count per user
    }
  }
});

// Output format: { id: 1, name: "Alice", _count: { posts: 4 } }

```

---

## 6. Enterprise Features

### Prisma Studio & Extensions (`$extends`)

Visual database management GUI and custom client hooks.

```bash
# Terminal command to launch Visual DB Studio
npx prisma studio

```

```javascript
// Prisma Extension (Soft Delete Hook)
const extendedPrisma = prisma.$extends({
  model: {
    user: {
      async softDelete(id) {
        return prisma.user.update({
          where: { id },
          data: { isActive: false }
        });
      }
    }
  }
});

// Usage
await extendedPrisma.user.softDelete(1);

```


# Prisma Database Connections (SQL & MongoDB)

Prisma SQL databases (PostgreSQL, MySQL, SQLite, etc.) aur MongoDB dono ko support karta hai. Neeche dono ke connection mechanisms aur schema configurations diye gaye hain.

---

## 1. Connecting Prisma to SQL Databases (PostgreSQL / MySQL)

SQL databases mein tables, foreign keys, aur migrations hote hain.

### Step 1: Environment File (`.env`)

Define your SQL connection string in the `.env` file.

```env
# PostgreSQL Example
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

# MySQL Example
# DATABASE_URL="mysql://username:password@localhost:3306/mydb"

```

### Step 2: Schema Configuration (`schema.prisma`)

Set the `provider` to `postgresql` or `mysql`.

```prisma
datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// SQL Model with Auto-Increment ID & Foreign Keys
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

```

### Step 3: Run Migrations (SQL Specific)

SQL databases require migration files to sync the schema with the database tables.

```bash
# Create and apply migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

```

---

## 2. Connecting Prisma to MongoDB

MongoDB is a document-based NoSQL database. It uses `@map("_id")` and `String @db.ObjectId` instead of auto-incrementing integers.

### Step 1: Environment File (`.env`)

Define your MongoDB connection URI (Atlas or Local).

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority"

```

### Step 2: Schema Configuration (`schema.prisma`)

Set the `provider` to `mongodb`.

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// MongoDB Model using ObjectId
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  title    String
  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

```

### Step 3: Push Schema to MongoDB (No Migrations)

MongoDB does not use structured migration files. Instead, use `db push` to sync your indexes and schema rules.

```bash
# Push schema directly to MongoDB (Do NOT run prisma migrate dev for MongoDB)
npx prisma db push

# Generate Prisma Client
npx prisma generate

```

---

## 3. Client Initialization Code (Universal)

The Javascript initialization code remains identical regardless of whether you use SQL or MongoDB:

```javascript
// src/config/prisma.js
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

```

---

## 💡 Key Differences Summary

| Feature | SQL (PostgreSQL/MySQL) | MongoDB (NoSQL) |
| --- | --- | --- |
| **Provider** | `postgresql` / `mysql` | `mongodb` |
| **Primary Key ID** | `Int @id @default(autoincrement())` | `String @id @default(auto()) @map("_id") @db.ObjectId` |
| **Schema Sync Command** | `npx prisma migrate dev` | `npx prisma db push` |
| **Foreign Keys** | Native SQL Foreign Keys | Application-level Prisma references |
