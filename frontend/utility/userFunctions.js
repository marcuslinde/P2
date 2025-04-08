const apiBase = '/api/user'
/** calls the database via userID to find a user. Returns the user object with the data given from backend
   * @function
   * @param {string} id 
*/
export async function getUserById(id) {

    try {
        // API CALL TO REGISTER USER
        const response = await fetch(apiBase + '/'+id)

        if (!response.ok) {
            throw new Error("User does not exist");
        }

        const data = await response.json()

        return data.user;
    } catch(err) {
        throw err
    }

}