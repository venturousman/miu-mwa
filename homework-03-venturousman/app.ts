import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import UserModel, { User } from './schema/user';
import CourseModel, { Course, Question } from './schema/course';

dotenv.config();

main().catch((err) => console.log(err));

// async function addUser(user: User) {
//     const newUser = await UserModel.create(user);
//     return newUser;
// }

async function addUser(
    fullname: String,
    email: String,
    password: String,
    location: Number[] = [],
    hobbies: String[] = [],
) {
    const newUser = new UserModel({
        fullname,
        email,
        password,
        location,
        hobbies,
    });
    return newUser.save();
    // This is also correct
    // return UserModel.create({
    //     fullname,
    //     email,
    //     password,
    //     location,
    //     hobbies,
    // });
}

async function addCourse(
    code: String,
    title: String,
    userId: Types.ObjectId,
    fullname: String,
    email: String,
) {
    const newCourse = new CourseModel({
        code,
        title,
        created_by: {
            user_id: userId,
            fullname,
            email,
        },
    });
    return newCourse.save();
}

async function addLecture(
    courseId: Types.ObjectId,
    title: String,
    description: String,
) {
    const newLecture = { title, description };
    return CourseModel.findByIdAndUpdate(
        courseId,
        { $push: { lectures: newLecture } },
        { new: true },
    );
}

async function addQuestion(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
    question: String,
    due_date: Number = Date.now() + 86400000,
) {
    const newQuestion = { question, due_date };
    return CourseModel.findByIdAndUpdate(
        courseId,
        { $push: { 'lectures.$[lecture].questions': newQuestion } },
        { arrayFilters: [{ 'lecture._id': lectureId }], new: true },
    );
}

async function getAllQuestions(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
    page: number = 1,
    limit: number = 10,
) {
    return CourseModel.aggregate([
        { $match: { _id: courseId } },
        { $unwind: '$lectures' },
        { $match: { 'lectures._id': lectureId } },
        { $unwind: '$lectures.questions' },
        {
            $project: {
                _id: 0,
                question: '$lectures.questions.question',
                due_date: '$lectures.questions.due_date',
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ]);
}

async function getQuestionById(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
    questionId: Types.ObjectId,
) {
    return CourseModel.aggregate([
        { $match: { _id: courseId } },
        { $unwind: '$lectures' },
        { $match: { 'lectures._id': lectureId } },
        { $unwind: '$lectures.questions' },
        { $match: { 'lectures.questions._id': questionId } },
        {
            $project: {
                _id: 0,
                question: '$lectures.questions.question',
                due_date: '$lectures.questions.due_date',
            },
        },
    ]);
}

async function updateQuestionById(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
    questionId: Types.ObjectId,
    question: String,
    // due_date: Number,
) {
    return CourseModel.updateOne(
        {
            _id: courseId,
            'lectures._id': lectureId,
            'lectures.questions._id': questionId,
        },
        {
            $set: {
                'lectures.$[lecture].questions.$[question].question': question,
                // 'lectures.$[lecture].questions.$[question].due_date': due_date, // this is also correct
            },
            $inc: {
                'lectures.$[lecture].questions.$[question].due_date': 86400000,
            }, // Add 1 day to all questions
        },
        {
            arrayFilters: [
                { 'lecture._id': lectureId },
                { 'question._id': questionId },
            ],
            new: true,
        },
    );
}

async function updateQuestions(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
) {
    return CourseModel.updateOne(
        {
            _id: courseId,
            'lectures._id': lectureId, // Match the specific course and lecture
        },
        {
            $inc: { 'lectures.$.questions.$[].due_date': 86400000 }, // Add 1 day to all questions
        },
    );
}

async function deleteQuestionById(
    courseId: Types.ObjectId,
    lectureId: Types.ObjectId,
    questionId: Types.ObjectId,
) {
    return CourseModel.updateOne(
        {
            _id: courseId,
            'lectures._id': lectureId,
        },
        {
            $pull: { 'lectures.$[lecture].questions': { _id: questionId } },
        },
        {
            arrayFilters: [{ 'lecture._id': lectureId }],
        },
    );
}

async function find10NearestUsers(
    location: Number[],
    hobbies: String[],
    limit: number = 10,
) {
    return UserModel.find({
        location: { $near: location }, // Geospatial query
        hobbies: { $in: hobbies }, // Match hobbies
    }).limit(limit);
}

async function main() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error('MongoDB URL is not provided');
    }
    await mongoose.connect(mongoUrl);

    // Create a function to add a new user with (fullname, email, password, and location with the following value [-91.96731488465576, 41.018654231616374])
    const addedUser1 = await addUser(
        'John Doe',
        'johndoe@miu.edu',
        'password',
        [-91.96731488465576, 41.018654231616374],
        ['reading', 'coding'],
    );
    console.log('Added user 1:', addedUser1);

    const addedUser2 = await addUser(
        'John Smith',
        'johnsmith@miu.edu',
        'password',
        [-91.96731488465576, 41.018654231616374],
        ['traveling', 'swimming'],
    );
    console.log('Added user 2:', addedUser2);

    const addedUser3 = await addUser(
        'Alan Smith',
        'alansmith@miu.edu',
        'password',
        [-91.96731488465576, 41.018654231616374],
        ['reading', 'traveling', 'hiking'],
    );
    console.log('Added user 3:', addedUser3);

    console.log('===========================================================');

    // Create a function to add a new course with (code, title).
    // Use the output of the previous function to fill out the created_by properties (prefixed hard-coded values).
    const addedCourse1 = await addCourse(
        'CS572',
        'Modern Web Applications',
        addedUser1._id,
        addedUser1.fullname,
        addedUser1.email,
    );
    console.log('Added course 1:', addedCourse1);

    console.log('===========================================================');

    // Create a function to add a new lecture with (title, description).
    const courseAfterAddingLecture = await addLecture(
        addedCourse1._id,
        'Lecture 1',
        'Introduction to NodeJS',
    );
    console.log('Added lecture 1:', courseAfterAddingLecture);

    console.log('===========================================================');

    // Create a function to add a new question with (question).
    if (courseAfterAddingLecture != null) {
        const courseAfterAddingQuestion = await addQuestion(
            addedCourse1._id,
            courseAfterAddingLecture.lectures[0]._id,
            'What is NodeJS?',
        );
        console.log('Added question 1:', courseAfterAddingQuestion);
        const courseAfterAddingQuestion2 = await addQuestion(
            addedCourse1._id,
            courseAfterAddingLecture.lectures[0]._id,
            'What is NPM?',
        );
        console.log('Added question 2:', courseAfterAddingQuestion2);
        console.log(
            '===========================================================',
        );

        // Create a function and use the aggregation pipeline to find all questions for a specific course ID and lecture ID. (with pagination).
        const questions = await getAllQuestions(
            addedCourse1._id,
            courseAfterAddingLecture.lectures[0]._id,
        );
        console.log('All questions:', questions);
        console.log(
            '===========================================================',
        );

        // Create a function and use the aggregation pipeline to find one question by ID, for a given course ID and lecture ID.
        if (courseAfterAddingQuestion != null) {
            const question = await getQuestionById(
                addedCourse1._id,
                courseAfterAddingLecture.lectures[0]._id,
                courseAfterAddingQuestion.lectures[0].questions[0]._id,
            );
            console.log('Question by ID:', question);
            console.log(
                '===========================================================',
            );

            // Create a function to update a question by ID, for a given course ID and lecture ID, and extend the due date for another 1 day.
            const oldDueDate =
                courseAfterAddingQuestion.lectures[0].questions[0].due_date;
            console.log(
                'Old due date:',
                oldDueDate,
                new Date(oldDueDate),
                new Date(oldDueDate).getTime(),
            );
            const newDueDate = oldDueDate + 86400000;
            console.log('New due date:', newDueDate, new Date(newDueDate));
            const courseAfterUpdatingQuestion = await updateQuestionById(
                addedCourse1._id,
                courseAfterAddingLecture.lectures[0]._id,
                courseAfterAddingQuestion.lectures[0].questions[0]._id,
                'What is Node.js (updated)?',
                // newDueDate,
            );
            console.log('Updated question:', courseAfterUpdatingQuestion);
            console.log(
                '===========================================================',
            );
        }

        // Create a function to update all questions, for a given course ID and lecture ID, and extend the due date for another 1 day.
        const courseAfterUpdatingQuestions = await updateQuestions(
            addedCourse1._id,
            courseAfterAddingLecture.lectures[0]._id,
        );
        console.log('Updated questions:', courseAfterUpdatingQuestions);
        // re-fetch all questions
        const questions2 = await getAllQuestions(
            addedCourse1._id,
            courseAfterAddingLecture.lectures[0]._id,
        );
        console.log('All questions:', questions2);
        console.log(
            '===========================================================',
        );

        // Create a function to delete one question by ID, for a given course ID and lecture ID.
        if (courseAfterAddingQuestion2 != null) {
            const courseAfterDeletingQuestion = await deleteQuestionById(
                addedCourse1._id,
                courseAfterAddingLecture.lectures[0]._id,
                courseAfterAddingQuestion2.lectures[0].questions[1]._id,
            );
            console.log('Deleted question:', courseAfterDeletingQuestion);
            console.log(
                '===========================================================',
            );
        }

        // Create a function to find the nearest 10 users that match a certain set of hobbies, using 2d index.
        const nearestUsers = await find10NearestUsers(
            [40.7128, -74.006],
            ['reading'],
        );
        console.log('Nearest users:', nearestUsers);
    }

    mongoose.connection.close();
}
