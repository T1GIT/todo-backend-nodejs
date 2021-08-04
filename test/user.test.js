const mongoose = require('mongoose');

const manager = require('../database/memory-manager')
const User = require('../database/models/User')
const userService = require('../database/services/user');


beforeAll(async () => await manager.connect());

afterEach(async () => await manager.clear());

afterAll(async () => await manager.close());

describe('user ', () => {

    it('can be created correctly', async () => {
        expect(async () => await userService.create(userComplete))
            .not.toThrow();
    });

    it('found', async () => {
        expect((await User.find().exec()).length).toBe(1)
    })
});

const userComplete = {
    email: 'derbindima@gmail.com',
    password: 'ifjeijfj39j23',
};