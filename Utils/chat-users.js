const chatUsers = []


const addUser = (userObject) => {
    let { name, role } = userObject;
    name = name.trim().toLowerCase();
    role = role.trim().toLowerCase();

    const user = { id: userObject.id, name, role }
    chatUsers.push(user)

    return { user }
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

const generateMessageObject = (id, name, role) => {
    return {
        id,
        name,
        role,
        createdAt: new Date().getTime()
    }
}

const generateMessage = (id, name, role,message) => {
    return {
        id,
        name,
        role,
        message,
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
