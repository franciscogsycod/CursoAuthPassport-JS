const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UsersService = require('../../../services/users');

passport.use(new BasicStrategy(async function(email, password, callback){
    const userService = new UsersService();
    try {
        const user = await userService.getUser({ email });
        if(!user){
            return callback(boom.unauthorized(), false);
        }
        if(!(await bcrypt.compare(password, user.password))){
            return callback(boom.unauthorized(), false);
        }
        delete user.password;
        return callback(null, user);
        
    }catch(error) {
        return callback(error)
    }
}))