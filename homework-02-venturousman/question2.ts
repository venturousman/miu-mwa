import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';

import { Post, PostModel, Comment } from './schema/post';

dotenv.config();

main().catch(err => console.log(err));

async function addPost(post: Post) {
    const newPost = new PostModel(post);
    return newPost.save();
}

async function addComment(postId: Types.ObjectId, comment: Comment) {
    return PostModel.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });

    // return PostModel.findOneAndUpdate(
    //     { _id: postId },
    //     { $push: { comments: comment } },
    //     { new: true, projection: { comments: { $slice: -1 } } }
    //   ).then(updatedPost => updatedPost?.comments?.[0]);
}

async function getComments(postId: Types.ObjectId, page: number, limit: number) {
    return PostModel.findById(postId, { comments: { $slice: [(page - 1) * limit, limit] } });
}

async function updateComment(postId: Types.ObjectId, commentId: Types.ObjectId, text: string) {
    return PostModel.findOneAndUpdate({ _id: postId, 'comments._id': commentId }, { $set: { 'comments.$.text': text } }, { new: true });
}

async function deleteComment(postId: Types.ObjectId, commentId: Types.ObjectId) {
    return PostModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId } } }, { new: true });
}

async function main() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error('MongoDB URL is not provided');
    }
    await mongoose.connect(mongoUrl);

    // add a new post _(with empty comments[] array)_
    const post1: Post = {
        title: 'Post 1',
        body: 'Body of post 1',
    };
    var addedPost1 = await addPost(post1);
    console.log("Post 1 added: ", addedPost1);

    console.log('===========================================================');

    // add a new comment to a specific post id
    const comment1: Comment = {
        text: 'Comment 1',
        user: {
            email: 'user1@miu.edu',
            name: 'User 1',
        },
    };
    var updatedPost1 = await addComment(addedPost1._id, comment1);
    console.log("Comment 1 added to Post 1: ", updatedPost1);

    const comment2: Comment = {
        text: 'Comment 2',
        user: {
            email: 'user2@miu.edu',
            name: 'User 2',
        },
    };
    var updatedPost2 = await addComment(addedPost1._id, comment2);
    console.log("Comment 2 added to Post 1: ", updatedPost2);

    console.log('===========================================================');

    // return all comments for a specific post id, with pagination
    var comments = await getComments(addedPost1._id, 1, 10);
    console.log("Comments for Post 1: ", comments);

    console.log('===========================================================');

    // update a comment text, identified by post id, and comment id
    if (comments && comments.comments && comments.comments.length > 0) {
        var updatedComment = await updateComment(addedPost1._id, comments.comments[0]._id, 'Updated Comment 1');
        console.log("Comment 1 updated: ", updatedComment);
    } else {
        console.log('No comments found to update');
    }

    console.log('===========================================================');

    // delete a comment by comment id, for a specific post id
    if (comments && comments.comments && comments.comments.length > 0) {
        var deletedComment = await deleteComment(addedPost1._id, comments.comments[0]._id);
        console.log("Comment 1 deleted: ", deletedComment);
    } else {
        console.log('No comments found to delete');
    }

    console.log('===========================================================');

    mongoose.connection.close();
}