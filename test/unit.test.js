import { jest } from '@jest/globals'; //globals -> global variable/functions/obj for mocks (kinda soaking up functions)

//No browser local storage so we make a mock
global.localStorage = {
    _store: {},
    setItem(key, value) {
        this._store[key] = value;
    },
    getItem(key) {
        return this._store.hasOwnProperty(key) ? this._store[key] : null;
    },
    removeItem(key) {
        delete this._store[key];
    },
    clear() {
        this._store = {};
    }
};
import { comparePassword, hashPassword } from "../backend/controllers/encryption.js";
import {Ship, createShips} from "frontend/pages/game/gameHelpers/ships.js";
import {User,setUser,Game,setGame} from "frontend/utility/state.js";

describe("Test password encryption", () => {
    // generate random password
    let password = ""
    for (let i = 0; i < 10; i++) {
        password += String.fromCodePoint(Math.floor((Math.random() * 93)) + 33)
    }
    test("generated password has length 10", () => {
        expect(password.length).toBe(10);
    });


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

describe('Ship class', () => {
    test('constructor sets name, length and defaults', () => {
        const s = new Ship('destroyer', 2);
        expect(s.name).toBe('destroyer');
        expect(s.length).toBe(2);
        expect(s.rotation).toBe('vertical');
        expect(s.coveredFields).toBeNull();
        expect(s.hits).toBe(0);
        expect(s.isSunk).toBe(false);
    });

    test('setRotation allows only "vertical" or "horizontal"', () => {
        const s = new Ship('submarine', 3);
        s.setRotation('horizontal');
        expect(s.rotation).toBe('horizontal');
        s.setRotation('diagonal');       // invalid
        expect(s.rotation).toBe('horizontal');
    });

    test('covered fields can be assigned and retrieved', () => {
        const s = new Ship('cruiser', 3);
        const fields = [11, 12, 13];
        s.setcoveredFields(fields);
        expect(s.getOccupiedFields()).toEqual(fields);
    });

    describe('hitShip and sinking logic', () => {
        let s;
        beforeEach(() => { //before each runs before each test in this block
            s = new Ship('battleship', 4);
            // stub out displaySunkMessage so it doesn’t actually alert
            s.displaySunkMessage = jest.fn();
        });

        test('hitShip increments hits and does not sink prematurely', () => {
            s.hitShip();
            expect(s.hits).toBe(1);
            expect(s.isSunk).toBe(false);
            expect(s.displaySunkMessage).not.toHaveBeenCalled();
        });

        test('ship sinks when hits reach length', () => {
            for (let i = 0; i < 4; i++) s.hitShip();
            expect(s.hits).toBe(4);
            expect(s.isSunk).toBe(true);
            expect(s.displaySunkMessage).toHaveBeenCalledTimes(1);
        });
    });
});

describe('createShips helper', () => {
    test('produces exactly five ships of correct types and lengths', () => {
        const ships = createShips();
        const specs = [
            ['destroyer', 2],
            ['submarine', 3],
            ['cruiser', 3],
            ['battleship', 4],
            ['carrier', 5],
        ];

        expect(ships).toHaveLength(5);
        specs.forEach(([name, len], i) => {
            expect(ships[i].name).toBe(name);
            expect(ships[i].length).toBe(len);
        });
    });
});

describe("State Management", () =>{
    test("should handle user state", ()=>{
        const testUser={
            _id: "123",
            name: "TestUser",
            email: "test@test.com"
        };
        setUser(testUser);
        expect(User()).toEqual(testUser);

        setUser(null);
        expect(User()).toBeNull();
    });
    test("should handle game state",()=>{
        const testGame={
            _id: "456",
            gameCode: "TEST",
            status: "waiting"
        };
        setGame(testGame);
        expect(Game()).toEqual(testGame);

        setGame(null);
        expect(Game()).toBeNull();
    })
});