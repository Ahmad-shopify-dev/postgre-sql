// src/controllers/userController.js
import {
  createNewUser,
  createMultipleUsers,
  createManyAndReturnUsers,
  getAllUsers,
  getUserByEmail,
  getFirstActiveUser,
  getFilteredUsers,
  getUserNamesAndPostTitles,
  getUsersWithPagination,
  updateUser,
  upsertUser,
  deactivateIncapableUsers,
  deleteUser,
  deleteInactiveUsers,
  getUserStats,
  userWithProfile,
} from "../services/userService.js";

/* ==========================================================================
   1. CREATE CONTROLLERS
   ========================================================================== */

export const handleCreateNewUser = async (userdata) => {
  if (!userdata) {
    return {
      success: false,
      data: null,
      error: "Function must contain a user object to insert data",
    };
  }

  try {
    const usercreated = await createNewUser(userdata);
    return {
      success: true,
      data: usercreated,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleCreateMultipleUsers = async (usersArray) => {
  if (!Array.isArray(usersArray) || usersArray.length === 0) {
    return {
      success: false,
      data: null,
      error: "An array containing user objects is required for bulk creation",
    };
  }

  try {
    const result = await createMultipleUsers(usersArray);
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleCreateManyAndReturnUsers = async (usersArray) => {
  if (!Array.isArray(usersArray) || usersArray.length === 0) {
    return {
      success: false,
      data: null,
      error: "An array of user objects is required",
    };
  }

  try {
    const insertedUsers = await createManyAndReturnUsers(usersArray);
    return {
      success: true,
      data: JSON.stringify(insertedUsers, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   2. READ CONTROLLERS
   ========================================================================== */

export const handleGetUsers = async () => {
  try {
    const users = await getAllUsers();
    const jsonUsers = JSON.stringify(users, null, 2);
    return {
      success: true,
      data: jsonUsers,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleGetUserByEmail = async (email) => {
  if (!email) {
    return {
      success: false,
      data: null,
      error: "Email string is required to search for user",
    };
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not found with the provided email",
      };
    }

    return {
      success: true,
      data: JSON.stringify(user, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleGetFirstActiveUser = async () => {
  try {
    const user = await getFirstActiveUser();
    return {
      success: true,
      data: user ? JSON.stringify(user, null, 2) : null,
      error: user ? null : "No active user found",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleGetFilteredUsers = async () => {
  try {
    const users = await getFilteredUsers();
    return {
      success: true,
      data: JSON.stringify(users, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   3. FIELD SELECTION CONTROLLER
   ========================================================================== */

export const handleGetUserNamesAndPostTitles = async () => {
  try {
    const users = await getUserNamesAndPostTitles();
    return {
      success: true,
      data: JSON.stringify(users, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   4. PAGINATION CONTROLLER
   ========================================================================== */

export const handleGetUsersWithPagination = async (pageNumber, pageSize) => {
  try {
    const page = Number(pageNumber) || 1;
    const limit = Number(pageSize) || 10;

    const users = await getUsersWithPagination(page, limit);
    return {
      success: true,
      data: JSON.stringify(users, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   5. UPDATE CONTROLLERS
   ========================================================================== */

export const handleUpdateUser = async (userId, updateData) => {
  if (!userId || !updateData) {
    return {
      success: false,
      data: null,
      error: "User ID and update data payload are required",
    };
  }

  try {
    const updatedUser = await updateUser(userId, updateData);
    return {
      success: true,
      data: updatedUser,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleUpsertUser = async (userdata) => {
  if (!userdata || !userdata.email) {
    return {
      success: false,
      data: null,
      error: "User data object with an email is required for upsert",
    };
  }

  try {
    const result = await upsertUser(userdata);
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleDeactivateIncapableUsers = async () => {
  try {
    const result = await deactivateIncapableUsers();
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   6. DELETE CONTROLLERS
   ========================================================================== */

export const handleDeleteUser = async (userId) => {
  if (!userId) {
    return {
      success: false,
      data: null,
      error: "User ID is required to perform deletion",
    };
  }

  try {
    const deletedUser = await deleteUser(userId);
    return {
      success: true,
      data: deletedUser,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleDeleteInactiveUsers = async () => {
  try {
    const result = await deleteInactiveUsers();
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

/* ==========================================================================
   7. AGGREGATION & STATS CONTROLLER
   ========================================================================== */

export const handleGetUserStats = async () => {
  try {
    const stats = await getUserStats();
    return {
      success: true,
      data: JSON.stringify(stats, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

export const handleUserWithProfile = async (userdata) => {
  if (!userdata) {
    return {
      success: false,
      data: null,
      error: "Function must contain a user object to insert data",
    };
  }

  try {
    const userwithprofile = await userWithProfile(userdata);
    return {
      success: true,
      data: userwithprofile,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};