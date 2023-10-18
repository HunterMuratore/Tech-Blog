const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../config/connection');

const Post = require('./Post');

class User extends Model { }

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true, 
            msg: 'That email address is already in use.'
        },
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: 6, 
                msg: 'Password must be at least 6 characters long.'
            }
        }
    }
}, {
    modelName: 'user',
    sequelize: db,
    hooks: {
        // Hook into the user right before it gets added to the table
        async beforeCreate(user) {
            // Encrypt the user's password with 10 salts (layers of encryption)
            user.password = await hash(user.password, 10);

            return user;
        }
    }
});

// Create a method on the user that will compare the password they submitted in the login form to the encrypted password in the database
User.prototype.validatePass = async function(form_password) {
    const is_valid = await compare(form_password, this.password);

    return is_valid;
}

/* Associations */
// User object will have the property 'posts' on it that will have all of that user's posts
User.hasMany(Post, { as: 'posts', foreignKey: 'author_id' });
// Post object will have the property 'author' on it that will be the User who wrote the post
Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

module.exports = User;