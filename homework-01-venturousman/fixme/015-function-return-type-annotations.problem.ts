
interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "super-admin";
  posts: Array<Post>;
}

interface Post {
  id: number;
  title: string;
}

// How do we ensure that makeUser ALWAYS returns a user?
const makeUser = () => {
  const defaultUser : User = {
    id: 0,
    firstName: "First Name",
    lastName: "Last Name",
    role: "user",
    posts: [
      {
        id: 0,
        title: "Title",
      },
    ],
  };
  return defaultUser;
};

const user = makeUser();

console.log(user.id);
console.log(user.firstName);
console.log(user.lastName);
console.log(user.role);

console.log(user.posts[0]?.id);
console.log(user.posts[0]?.title);
