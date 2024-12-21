import { Schema } from 'mongoose';
import { User, UserModel } from '../models/userModel';
import bcrypt from 'bcrypt';

async function createUserObject(user: User) {
    return UserModel.create(user);
}

async function createUser(
    fullname: string,
    email: string,
    password: string,
    picture_url: string | undefined = undefined,
) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return UserModel.create({
        fullname,
        email,
        password: encryptedPassword,
        picture_url,
    });
}

async function getUsers(page: number = 1, limit: number = 10) {
    return UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
}

// Schema.Types.ObjectId
async function getUserById(id: string) {
    return UserModel.findById(id);
}

async function getUserByEmail(email: string) {
    return UserModel.findOne({ email });
}

async function updateUserById(id: string, user: User) {
    // return UserModel.findByIdAndUpdate(id, user, { new: true });
    return UserModel.updateOne({ _id: id }, user);
}

async function deleteUserById(id: string) {
    // return UserModel.findByIdAndDelete(id);
    return UserModel.deleteOne({ _id: id });
}

export default {
    createUserObject,
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
