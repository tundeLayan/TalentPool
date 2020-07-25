const chatUsers = []


const addUser = (userObject) => {
    let {
        name,
        role
    } = userObject;
    name = name.trim().toLowerCase();
    role = role.trim().toLowerCase();

    const user = {
        id: userObject.id,
        userId: userObject.userId,
        name,
        role,
    }
    chatUsers.push(user)

    return {
        user
    }
}

const removeUser = (id) => {
    const index = chatUsers.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return chatUsers.splice(index, 1)
    }
    return null;
}

const getUser = (id) => {
    return chatUsers.find((user) => {
        return user.id === id
    })
}

const generateMessageObject = (userId, name, role) => {
    return {
        userId,
        name,
        role,
        createdAt: new Date().getTime()
    }
}

const generateMessage = (message, readStatus, receiverId, userId) => {
    return {
        message,
        readStatus,
        receiverId,
        userId,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    generateMessage,
    generateMessageObject
}