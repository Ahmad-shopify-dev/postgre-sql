// src/services/userService.js
import { prisma } from "../config/prisma.js";

/* ==========================================================================
   1. CREATE OPERATIONS
   ========================================================================== */

/**
 * Creates a single user along with nested posts in a single transaction.
 * @param {Object} userdata - User creation details (name, email, age, isActive, posts)
 */
export const createNewUser = async (userdata) => {
  const userCreated = await prisma.user.create({
    data: {
      name: userdata.name,
      email: userdata.email,
      age: userdata.age,
      isActive: userdata.isActive,
      posts: {
        create: userdata.posts || [], // Accepts single object or array of objects
      },
    },
    include: {
      posts: true, // Include created relational posts in response
    },
  });
  return userCreated;
};

/**
 * Bulk creates multiple user records in a single query.
 * Note: `createMany` does not support nested relational creates (like creating posts simultaneously).
 * @param {Array<Object>} usersArray - Array of user objects
 */
export const createMultipleUsers = async (usersArray) => {
  const result = await prisma.user.createMany({
    data: usersArray,
    skipDuplicates: true, // Skips records that violate unique constraints (e.g., duplicate emails)
  });
  return result; // Returns count of created records: { count: number }
};

export const createManyAndReturnUsers = async (usersArray) => {
  // Insert multiple recodes and return the inserted data
  const createdUsers = await prisma.user.createManyAndReturn({
    data: usersArray,
    skipDuplicates: true, // Optional: duplicate email skip
    select: {
      // Optional: if you want to get specific fields
      id: true,
      name: true,
      email: true,
    },
  });

  return createdUsers; // Array of actual inserted user objects
};

/* ==========================================================================
   2. READ OPERATIONS (FIND & SEARCH)
   ========================================================================== */

/**
 * Retrieves all users with their associated posts.
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  return users;
};

/**
 * Finds a single user by a unique identifier or @unique field.
 * @param {string} email - Email address to search for
 */
export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      posts: true,
    },
  });
  return user;
};

/**
 * Retrieves the first record matching a specific condition.
 */
export const getFirstActiveUser = async () => {
  const user = await prisma.user.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc", // Get the most recently created active user
    },
  });
  return user;
};

/**
 * Fetches users using advanced filtering, numerical comparison operators, and relation filters.
 */
export const getFilteredUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,

      // Range operators: gte (>=), lte (<=), gt (>), lt (<)
      age: {
        gte: 18,
        lte: 50,
      },

      // String pattern matching: contains, startsWith, endsWith
      email: {
        endsWith: "@gmail.com",
      },

      // Relational filtering: Find users who have at least one published post
      posts: {
        some: {
          published: true,
        },
      },
    },
    orderBy: {
      name: "asc", // Sort alphabetically A-Z
    },
  });
  return users;
};

/* ==========================================================================
   3. FIELD SELECTION (OPTIMIZING PAYLOAD)
   ========================================================================== */

/**
 * Selects specific fields to optimize payload size instead of returning all columns.
 * Note: Cannot use `select` and `include` at the same top level.
 */
export const getUserNamesAndPostTitles = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      // Nested field selection on relations
      posts: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return users;
};

/* ==========================================================================
   4. PAGINATION
   ========================================================================== */

/**
 * Fetches paginated records using skip (offset) and take (limit).
 * @param {number} pageNumber - Current page index (1-based)
 * @param {number} pageSize - Number of items per page
 */
export const getUsersWithPagination = async (pageNumber = 1, pageSize = 10) => {
  const skipRecords = (pageNumber - 1) * pageSize;

  const users = await prisma.user.findMany({
    skip: skipRecords, // Number of records to skip
    take: pageSize, // Number of records to fetch
    orderBy: {
      id: "asc",
    },
  });
  return users;
};

/* ==========================================================================
   5. UPDATE OPERATIONS
   ========================================================================== */

/**
 * Updates a single user by primary key (ID).
 * @param {number} userId - ID of the user to update
 * @param {Object} updateData - Data fields to update
 */
export const updateUser = async (userId, updateData) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      name: updateData.name,
      age: updateData.age,
    },
  });
  return updatedUser;
};

/**
 * Updates an existing user record, or creates a new one if it doesn't exist.
 * @param {Object} userdata - User data containing matching criteria and payload
 */
export const upsertUser = async (userdata) => {
  const user = await prisma.user.upsert({
    where: {
      email: userdata.email,
    },
    update: {
      name: userdata.name,
      isActive: userdata.isActive,
    },
    create: {
      email: userdata.email,
      name: userdata.name,
      age: userdata.age,
    },
  });
  return user;
};

/**
 * Updates multiple records matching a condition in a single query.
 */
export const deactivateIncapableUsers = async () => {
  const result = await prisma.user.updateMany({
    where: {
      age: {
        lt: 18, // Age < 18
      },
    },
    data: {
      isActive: false,
    },
  });
  return result; // Returns count of updated records: { count: number }
};

/* ==========================================================================
   6. DELETE OPERATIONS
   ========================================================================== */

/**
 * Deletes a single user by ID.
 * @param {number} userId - ID of the user to delete
 */
export const deleteUser = async (userId) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: Number(userId),
    },
  });
  return deletedUser;
};

/**
 * Deletes multiple user records matching a condition.
 */
export const deleteInactiveUsers = async () => {
  const result = await prisma.user.deleteMany({
    where: {
      isActive: false,
    },
  });
  return result; // Returns count of deleted records: { count: number }
};

/* ==========================================================================
   7. AGGREGATION & COUNTING
   ========================================================================== */

/**
 * Demonstrates dataset counting and aggregate calculations (AVG, MIN, MAX, SUM).
 */
export const getUserStats = async () => {
  // Count records matching criteria
  const totalActiveUsers = await prisma.user.count({
    where: { isActive: true },
  });

  // Calculate mathematical aggregations on numerical fields
  const ageStats = await prisma.user.aggregate({
    _avg: { age: true },
    _min: { age: true },
    _max: { age: true },
    _sum: { age: true },
  });

  return { totalActiveUsers, ageStats };
};

// RELATIONSHIPS IN MODELS
export const userWithProfile = async (userdata) => {
  const userWithProfile = await prisma.user.create({
    data: {
      name: userdata.name,
      email: userdata.email,
      age: userdata.age,
      isActive: userdata.isActive,
      profile: {
        create: {
          bio: userdata.bio,
        },
      },
    },
  });

  return userWithProfile;
};

// SOME USERS WITH ATLEAST SINGLE POST PUBLISHED
export const someUsers = async () => {
  const userWithatleastSinglePostPublished = await prisma.user.find({
    where: {
      posts: {
        some: {
          published: true,
        },
      },
    },
  });
};

// USERS MUST HAVE ALL POSTS PUBLISHED
export const everyUsers = async () => {
  const userWithEveryPostPublished = await prisma.user.find({
    where: {
      posts: {
        every: {
          published: true,
        },
      },
    },
  });
};

// USER WITH NON-PUBLISHED POSTS
export const nonPublishedUsers = async () => {
  const usersWithAllNonPublishedPosts = await prisma.user.find({
    where: {
      posts: {
        none: {
          published: false,
        },
      },
    },
  });
};

// CONNECT, DISCONNECT AND INCREMENT
export const postWithValues = async (postdata) => {
  const postValues = await prisma.post.create({
    data: {
      title: postdata.title,
      author: {
        connect: {
          id: 5,
        },
      },
      age: {
        increment: 5, // ATOMIC number operator on database level calculation
      },
    },
  });
};

export const usersWithPostCount = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    _count: {
      select: { posts: true }, // subquery will count total posts for the user
    },
  },
});

// SOFT DELETE WITH PRISMA EXTENSION
export const softDelete = async() {
    const extendedPrisma = prisma.$extends({
      model: {
        user: {
          async softDelete(id) {
            return prisma.user.update({
              where: { id },
              data: { isActive: false },
            });
          },
        },
      },
    });
    
    // Usage
    await extendedPrisma.user.softDelete(1);
}