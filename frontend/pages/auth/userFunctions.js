const apiBase = '/auth'
/** calls the database for user validation and then sets the user in the frontend to a user object returned by the database
   * @function
   * @param {string} username
   * @param {string} password 
*/
export async function login(username, password) {
    try {
        const response = await fetch(apiBase + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })

        if (!response.ok) {
            window.alert(`${response.status}: Invalid username or password`);
            throw new Error("User not found");
        }
        const data = await response.json();


        return data.user;

    }
    catch (err) {
        console.log(err);
    }
}


/**
 * calls the api for register user and returns the user
 * @param {object} user 
 * @returns {Promise<object>}  
 */
export async function registerUser(user) {
    try {
        // API CALL TO REGISTER USER
        const response = await fetch(apiBase + '/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            throw new Error("User could not be registered");
        }

        const data = await response.json()


        return data.newUser;

    }

    catch (err) {
        console.log(err);
    }
}