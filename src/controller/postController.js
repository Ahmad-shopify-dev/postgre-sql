// src/controllers/postController.js
import {
  createNewPost,
  createMultiplePosts,
  createManyAndReturnPosts,
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  searchPublishedPosts,
  getPostSummaries,
  getPostsWithPagination,
  updatePost,
  publishAllUserPosts,
  deletePost,
  deleteDraftPosts,
  getPostStats
} from "../services/postService.js";

/* ==========================================================================
   1. CREATE CONTROLLERS
   ========================================================================== */

export const handleCreateNewPost = async (postData) => {
  if (!postData || !postData.title || !postData.authorId) {
    return {
      success: false,
      data: null,
      error: "Post object must contain both 'title' and 'authorId'"
    };
  }

  try {
    const postCreated = await createNewPost(postData);
    return {
      success: true,
      data: postCreated,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleCreateMultiplePosts = async (postsArray) => {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return {
      success: false,
      data: null,
      error: "An array of post objects is required for bulk creation"
    };
  }

  try {
    const result = await createMultiplePosts(postsArray);
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleCreateManyAndReturnPosts = async (postsArray) => {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return {
      success: false,
      data: null,
      error: "An array of post objects is required"
    };
  }

  try {
    const insertedPosts = await createManyAndReturnPosts(postsArray);
    return {
      success: true,
      data: JSON.stringify(insertedPosts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/* ==========================================================================
   2. READ CONTROLLERS
   ========================================================================== */

export const handleGetPosts = async () => {
  try {
    const posts = await getAllPosts();
    return {
      success: true,
      data: JSON.stringify(posts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleGetPostById = async (postId) => {
  if (!postId) {
    return {
      success: false,
      data: null,
      error: "Post ID parameter is required"
    };
  }

  try {
    const post = await getPostById(postId);
    if (!post) {
      return {
        success: false,
        data: null,
        error: "Post not found with given ID"
      };
    }

    return {
      success: true,
      data: JSON.stringify(post, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleGetPostsByAuthor = async (authorId) => {
  if (!authorId) {
    return {
      success: false,
      data: null,
      error: "Author ID is required to fetch posts"
    };
  }

  try {
    const posts = await getPostsByAuthor(authorId);
    return {
      success: true,
      data: JSON.stringify(posts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleSearchPublishedPosts = async (keyword) => {
  if (!keyword) {
    return {
      success: false,
      data: null,
      error: "Search keyword is required"
    };
  }

  try {
    const posts = await searchPublishedPosts(keyword);
    return {
      success: true,
      data: JSON.stringify(posts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/* ==========================================================================
   3. SELECTION & PAGINATION CONTROLLERS
   ========================================================================== */

export const handleGetPostSummaries = async () => {
  try {
    const posts = await getPostSummaries();
    return {
      success: true,
      data: JSON.stringify(posts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleGetPostsWithPagination = async (pageNumber, pageSize) => {
  try {
    const page = Number(pageNumber) || 1;
    const limit = Number(pageSize) || 10;

    const posts = await getPostsWithPagination(page, limit);
    return {
      success: true,
      data: JSON.stringify(posts, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/* ==========================================================================
   4. UPDATE CONTROLLERS
   ========================================================================== */

export const handleUpdatePost = async (postId, updateData) => {
  if (!postId || !updateData) {
    return {
      success: false,
      data: null,
      error: "Post ID and update data payload are required"
    };
  }

  try {
    const updatedPost = await updatePost(postId, updateData);
    return {
      success: true,
      data: updatedPost,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handlePublishAllUserPosts = async (authorId) => {
  if (!authorId) {
    return {
      success: false,
      data: null,
      error: "Author ID is required"
    };
  }

  try {
    const result = await publishAllUserPosts(authorId);
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/* ==========================================================================
   5. DELETE & STATS CONTROLLERS
   ========================================================================== */

export const handleDeletePost = async (postId) => {
  if (!postId) {
    return {
      success: false,
      data: null,
      error: "Post ID is required to delete post"
    };
  }

  try {
    const deletedPost = await deletePost(postId);
    return {
      success: true,
      data: deletedPost,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleDeleteDraftPosts = async () => {
  try {
    const result = await deleteDraftPosts();
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export const handleGetPostStats = async () => {
  try {
    const stats = await getPostStats();
    return {
      success: true,
      data: JSON.stringify(stats, null, 2),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};