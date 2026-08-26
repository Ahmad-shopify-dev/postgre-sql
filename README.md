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




Awesome! Being a Node.js developer is a huge advantage—learning **Prisma** will feel super smooth and natural because Prisma’s type safety and query engine are built to work seamlessly with the JavaScript/TypeScript ecosystem 🔥.

Now that you understand SQL fundamentals (Indexes, Transactions, Types, Constraints, EXPLAIN), you already know the underlying database queries happening behind Prisma’s abstractions.

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