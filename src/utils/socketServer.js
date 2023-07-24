export let users = [];

export const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    return users
};

export const removeUser = (socketId) => {
 return users = users.filter((user) => user.socketId != socketId);
};

export const getUser=(userId)=>{
   const user =users.filter((user)=>{return user.userId==userId})
   return user[0]
}