 import api from "@/utils/api"

 export const updateUser = async (userData) => {
    try {
        if(userData){
            const { createdAt, updatedAt, ...rest } = userData;
            userData = rest;
        }
        const response = await api.patch('/api/users/update', userData);
        // console.log(response.data.message);
        return response.data;
    } catch (error) {
        console.log('Failed to update user:', error);
        return "Failed to update user";
    }
 }