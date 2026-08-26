import { createNewUser, getAllUsers } from "../services/userService.js";

export const handleCreateNewUser = async (userdata) => {
    if(!userdata) return {success: false, data: null, error: "Function must contains a user object to insert data"};

    try {
        const usercreated = await createNewUser(userdata);
        return {
          success: true,
          data: usercreated,
          error: null,
        };
    } catch(error) {
        return {
            success: false,
            data: null,
            error: error.message,
        };
    }
}


export const handleGetUsers = async () => {
    try {
        const users = await getAllUsers();
        const jsonUsers = await JSON.stringify(users, null, 2);
        return {
            success: true,
            data: jsonUsers,
            error: null
        }
    } catch(error) {
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}



