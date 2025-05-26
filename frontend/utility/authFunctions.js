const apiBase = '/api/auth'
/** calls the database for user validation and then sets the user in the frontend to a user object returned by the database
   * @function
   * @param {string} username
   * @param {string} password 
*/
export async function login(username, password) {

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


/**
 * calls the api for register user and returns the user
 * @param {object} user 
 * @returns {Promise<object>}  
 */
export async function registerUser(user) {
    // API CALL TO REGISTER USER
    const response = await fetch(apiBase + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  
    const data = await response.json();
  
    if (response.status === 409) {
      // duplicate‐key: username/email in use
      throw new Error(data.message);
    } else if (!response.ok) {
      // any other server failure
      throw new Error(data.message || "User could not be registered");
    }
  
    return data.newUser;
  }