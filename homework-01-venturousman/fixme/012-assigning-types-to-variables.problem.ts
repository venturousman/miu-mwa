interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const defaultUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  isAdmin: false
};

const getUserId = (user: User) => {
  return user.id;
};

getUserId(defaultUser);

