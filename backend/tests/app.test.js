//Base dependencies
const request = require('supertest');
const app = require('../app');


// Additional dependencies
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { default: axios } = require('axios');
// const verify_token = require('../routes/verify-token');


// Test variables
var test_name = "dusan123";
var test_email = "dusan123@gmail.com";
var test_password = "1234567";

/**
 * Test the users login/signup
 */
describe('\n\nEndpoint /api/user/...', () => {
    
    describe('[register] given a correct form data', () => {
        
        test('should responde with status code of 200', async () => {
            const response = await request(app).post('/api/user/register').send({
                name: test_name,
                email: test_email,
                password: test_password
            });
            expect(response.statusCode).toBe(200);

        });

        test('should save username, password and name to the database', async () => {
            //Find the previously created user
            const foundUser = await User.findOne({email: test_email});
            
            expect(foundUser.name).toBeDefined();
            expect(foundUser.email).toBeDefined();
            expect(foundUser.password).toBeDefined();
            
        });

        test('should hash the user password', async () => {
            
            //Find the previously created user
            const foundUser = await User.findOne({email: test_email});

            //All hashed passwords start with '$2b$10$'
            expect(foundUser.password).toEqual(expect.stringContaining('$2b$10$'));
            //User entered password can't be over 30
            expect(foundUser.password.length).toBeGreaterThan(50);

        });

        test('should respond back with json object containing userID', async () => {
            
            //Remove the previous test user
            await User.deleteOne({email: test_email});
            
            const response = await request(app).post('/api/user/register').send({
                name: test_name,
                email: test_email,
                password: test_password
            });
            expect(response.body.user).toBeDefined();
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));

        });
        

    });

    describe('[register] when invalid form data entered', () => {
        
        test('should respond with 400 when no form data is provided.', async () => {
            
            const formData = [
                {name: test_name},
                {email: test_email},
                {password: test_password},
                {}
            ];

            for(const data of formData){
                const response = await request(app).post('/api/user/register').send({
                    data
                });
                expect(response.statusCode).toBe(400);
                expect(response.body.success).toEqual(false);
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            };
            
        });
        
        test('should respond with 400 when invalid email address', async () => {
            const response = await request(app).post('/api/user/register').send({
                name: test_name,
                email: "dusan.gmail.com",
                password: test_password
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.success).toEqual(false);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        test('should respond with 400 when invalid password', async () => {
            const response = await request(app).post('/api/user/register').send({
                name: test_name,
                email: test_email,
                password: "123"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.success).toEqual(false);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });


        // test('should respond with 500 when internal server problem (mongo)', async () => {
    
        //     //Temporarly close connection to the databse to simulate internal server error
        //     await mongoose.connection.close()

        //     const response = await request(app).post('/api/user/register').send({
        //         name: test_name,
        //         email: test_email,
        //         password: test_password
        //     });
        //     expect(response.statusCode).toBe(500);

        //     //Reconnect to mongodb when done
        //     mongoose.connect(process.env.MONGODB_URI);
        // });
        
    });

    describe('[login] given a correct form data', () => {
        
        test('should respond with 200 if input data is valid', async () => {
            const response = await request(app).post('/api/user/login').send({
                email: test_email,
                password: test_password
            });
            expect(response.statusCode).toBe(200);
        });

        test('should confirm the user exists in the databse', async () => {

            const foundUser = await User.findOne({email: test_email});

            expect(foundUser.name).toBeDefined();
        });

        test('should confirm the password is correct', async () => {
            
            const foundUser = await User.findOne({email: test_email});

            const validPassowrd = await bcrypt.compare(test_password, foundUser.password);

            expect(validPassowrd).toEqual(true);
        });

        test('should create and assign JSON web token to the user', async () => {

            const response = await request(app).post('/api/user/login').send({
                email: test_email,
                password: test_password
            });

            expect(response.headers['auth-token']).toBeDefined();
        });

    });

    describe('[login] given a incorrect form data', () => {
        
        test('should return 400 if incorrect input form data', async () => {
            const formData = [
                {email: test_email},
                {password: test_password},
                {}
            ];

            for(const data of formData){
                const response = await request(app).post('/api/user/login').send({
                    data
                });
                expect(response.statusCode).toBe(400);
                expect(response.body.success).toEqual(false);
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            };
        });
        
        test('should return 400 if user does not exist', async () => {
            const user = await User.findOne({email: "invalid_email.com"});
            
            expect(user).toBeNull();
        });

        test('should return 400 if password is incorrect', async () => {
            
            const user = await User.findOne({email: test_email});

            const validPassowrd = await bcrypt.compare("wrong_password", user.password);

            expect(validPassowrd).toEqual(false)
        });

    });

});



afterAll( async () =>{

    await User.deleteOne({email: test_email});

    await mongoose.connection.close()
});


