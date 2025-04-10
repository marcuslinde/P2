import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(storedHashedPassword, passwordToCheck) {
    const match = await bcrypt.compare(passwordToCheck, storedHashedPassword);
    if (match) {
        return match;
    } else {
        console.log('Password does not match.');
    }
}