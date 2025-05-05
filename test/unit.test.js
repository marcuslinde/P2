import { comparePassword, hashPassword } from "../backend/controllers/encryption.js";

describe("Test password encryption", () => {
    // generate random password
    let password = ""
    for (let i = 0; i < 10; i++) {
        password += String.fromCodePoint(Math.floor((Math.random() * 93)) + 33)
    }
    expect(password.length).toBe(10);


    test(("Ensure correct password returns true"), async () => {
        const hashedPassword = await hashPassword(password)

        const isMatch = await comparePassword(hashedPassword, password)
        expect(isMatch).toBe(true)
    })
    test(("Ensure for wrong password returns false"), async () => {
        const hashedPassword = await hashPassword(password)
        const isMatch = await comparePassword(hashedPassword, "someWrongPassword")
        console.log("ismatch", isMatch)
        expect(isMatch).toBe(false)
    })
})

