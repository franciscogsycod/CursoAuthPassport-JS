const MongoLib = require('../lib/mongo');

class UserMoviesService {
    constructor() {
        this.collection = 'user-movies';
        this.mongoDB = new MongoLib();
    }

    async getUserMovies( { userID } ) {
        const query = userID && { userID };
        const userMovies = await this.mongoDB.getAll(this.collection, query);

        return userMovies || [];
    }
    async createUserMovie( { userMovieID } ) {
        const createdUserMovieID = this.mongoDB.create(this.collection, userMovieID);

        return createdUserMovieID;
    }
    async deleteUserMovie( { userMovieID } ) {
        const deletedUserMovieID = this.mongoDB.delete(this.collection, userMovieID);
        
        return deletedUserMovieID;
    }
}

module.exports = UserMoviesService;