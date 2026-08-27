// src/services/postService.js
import { prisma } from '../config/prisma.js';

/* ==========================================================================
   1. CREATE OPERATIONS
   ========================================================================== */

/**
 * Creates a single post linked to an existing author (User).
 * @param {Object} postData - Must include title and authorId. Content and published are optional.
 */
export const createNewPost = async (postData) => {
  const postCreated = await prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content,
      published: postData.published ?? false,
      authorId: postData.authorId // Foreign Key link to User model
    },
    include: {
      author: true // Include author details in response
    }
  });
  return postCreated;
};

/**
 * Bulk creates multiple posts in a single query.
 * @param {Array<Object>} postsArray - Array of post objects containing authorId, title, etc.
 */
export const createMultiplePosts = async (postsArray) => {
  const result = await prisma.post.createMany({
    data: postsArray
  });
  return result; // Returns { count: number }
};

/**
 * Bulk creates multiple posts and returns the inserted records.
 * @param {Array<Object>} postsArray - Array of post objects
 */
export const createManyAndReturnPosts = async (postsArray) => {
  const createdPosts = await prisma.post.createManyAndReturn({
    data: postsArray,
    select: {
      id: true,
      title: true,
      published: true,
      authorId: true,
      createdAt: true
    }
  });
  return createdPosts;
};

/* ==========================================================================
   2. READ OPERATIONS (FIND & SEARCH)
   ========================================================================== */

/**
 * Retrieves all posts along with their author details.
 */
export const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true
    }
  });
  return posts;
};

/**
 * Finds a single post by its Primary Key (ID).
 * @param {number} postId - ID of the post
 */
export const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    },
    include: {
      author: true
    }
  });
  return post;
};

/**
 * Retrieves posts created by a specific author.
 * @param {number} authorId - Foreign key of the user
 */
export const getPostsByAuthor = async (authorId) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: Number(authorId)
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return posts;
};

/**
 * Advanced search utilizing indexed title filtering and published status.
 * @param {string} searchKeyword - Keyword to match in title
 */
export const searchPublishedPosts = async (searchKeyword) => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      // String search leverage @@index([title]) for better database performance
      title: {
        contains: searchKeyword,
        mode: 'insensitive' // Case-insensitive matching
      }
    },
    orderBy: {
      title: 'asc'
    }
  });
  return posts;
};

/* ==========================================================================
   3. FIELD SELECTION & PAGINATION
   ========================================================================== */

/**
 * Selects lightweight fields for post cards/lists.
 */
export const getPostSummaries = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return posts;
};

/**
 * Fetches paginated posts using offset pagination.
 * @param {number} pageNumber - Current page number
 * @param {number} pageSize - Limit of records per page
 */
export const getPostsWithPagination = async (pageNumber = 1, pageSize = 10) => {
  const skipRecords = (pageNumber - 1) * pageSize;

  const posts = await prisma.post.findMany({
    skip: skipRecords,
    take: pageSize,
    orderBy: {
      createdAt: 'desc'
    }
  });
  return posts;
};

/* ==========================================================================
   4. UPDATE OPERATIONS
   ========================================================================== */

/**
 * Updates a single post record.
 * @param {number} postId - ID of the post
 * @param {Object} updateData - Data fields to update
 */
export const updatePost = async (postId, updateData) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: Number(postId)
    },
    data: {
      title: updateData.title,
      content: updateData.content,
      published: updateData.published
    }
  });
  return updatedPost;
};

/**
 * Bulk updates unpublished posts of a specific user to published.
 * @param {number} authorId - ID of the author
 */
export const publishAllUserPosts = async (authorId) => {
  const result = await prisma.post.updateMany({
    where: {
      authorId: Number(authorId),
      published: false
    },
    data: {
      published: true
    }
  });
  return result; // Returns { count: number }
};

/* ==========================================================================
   5. DELETE OPERATIONS & AGGREGATIONS
   ========================================================================== */

/**
 * Deletes a single post by ID.
 * @param {number} postId - ID of the post to delete
 */
export const deletePost = async (postId) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id: Number(postId)
    }
  });
  return deletedPost;
};

/**
 * Bulk deletes all draft (unpublished) posts.
 */
export const deleteDraftPosts = async () => {
  const result = await prisma.post.deleteMany({
    where: {
      published: false
    }
  });
  return result; // Returns { count: number }
};

/**
 * Returns counts and statistics for published vs draft posts.
 */
export const getPostStats = async () => {
  const totalPosts = await prisma.post.count();
  const publishedCount = await prisma.post.count({
    where: { published: true }
  });
  const draftCount = await prisma.post.count({
    where: { published: false }
  });

  return { totalPosts, publishedCount, draftCount };
};