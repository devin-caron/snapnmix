//Base dependencies
const request = require('supertest');
const app = require('../app');



/**
 * Test recipe apis
 */
 describe('\n\nEndpoint: /api/cocktails/...', () => {

    describe('[recipes] get recipe details', () => {

        test('should return JSON object with all drink categories', async () => {
            const response = await request(app).get('/api/cocktails/categories');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        test('should return JSON object with category for the specified name', async () => {
            const response = await request(app).get('/api/cocktails/categories/Ordinary_Drink');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        test('should return JSON object with all recipes starting with the letter', async () => {
            const response = await request(app).get('/api/cocktails/all/a');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        test('should return JSON object with all popular recipes', async () => {
            const response = await request(app).get('/api/cocktails/popular');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        test('should return JSON object with all the latest recipes', async () => {
            const response = await request(app).get('/api/cocktails/latest');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        
        test('should return JSON object with a recipe details of a random drink', async () => {
            const response = await request(app).get('/api/cocktails/random');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        //favorites

        //custom
        test('should return JSON object with a recipe details of the drinks mathcing the search word', async () => {
            const response = await request(app).get('/api/cocktails/search/moji');
            expect(response.statusCode).toBe(200);
            const recipe = JSON.parse(response.text);
            expect(recipe).toBeDefined();
        });  

        test('should response with 400 when invalid api endpoint is being called.', async () => {
            const response = await request(app).get('/api/cocktails/nonexistingendpoint');
            expect(response.status).toBe(404);
        });

    });


    describe('[recipes] advanced recipes manipulation', () => {
        
        // should verify if the authentication function works
        test('should verify if the authentication function works', async () => {
            // const response = await request(app).post('/api/favorites/add/:cocktailID', verify_token);
            // console.log(req.user._id);
        });

        // should add a recipe to the lisr of the favorite recipes in the database
        test('', async () => {});
        
        // should handle the invalid idDrink error when storing drink to favorites
        test('', async () => {});
        
        test('', async () => {});
        
        test('', async () => {});
        
        test('', async () => {});
        
    });
});



