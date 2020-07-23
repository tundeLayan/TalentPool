/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const Sequelize = require('sequelize');
const model = require('../../Models/index');

const {
    Op
} = Sequelize;



const employerChatUsers = async () => {
    const users = await model.Employer.findAll({
        raw: true,
        attributes: ['userId', 'employerPhoto'],
        include: [{
            model: model.User,
            attributes: ['roleId'],
        },],
    })

    return users
};

const employeeChatUsers = async () => {
    const users = model.Employee.findAll({
        raw: true,
        attributes: ['userId', 'image'],
        include: [{
            model: model.User,
            attributes: ['roleId'],
        },],
    })

    return users
};


module.exports = {
   
    employerMessagePage: async (req, res) => {
        try {

            const employeeChatUsersResult = await employeeChatUsers(req, res);

            const employerUsers = [...employeeChatUsersResult];

            res.status(200).render('Pages/employer-messages', {
                pageName: 'Employer Messages',
                pageTitle: 'TalentPool | Employer Message',
                userId: req.session.userId,
                role: req.session.data.userRole,
                path: '/employer/message',
                employerUsers,
                error: req.flash('error'),
                errors: req.flash('errors'),
                success: req.flash('success'),
            });
        } catch (err) {
            console.log(err);
        }
    },

    employeeMessagePage: async (req, res) => {
        let userId;
        let employeeId;

        const {
            passport
        } = req.session;

        if (passport) {
            const {
                passport: {
                    user
                },
            } = req.session;
            userId = user.userId || user.user_id;
            const {
                userTypeId
            } = user;
            employeeId = userTypeId || req.session.profileId;
        } else {
            userId = req.session.userId;
            employeeId = req.session.employeeId || req.session.profileId;
        }

        try {
            const employerChatUsersResult = await employerChatUsers(req, res);

            const employeeUsers = [...employerChatUsersResult];
            data = {
                employee: {
                    image: req.session.profileImage,
                    username: req.session.firstName,
                },
            };
            res.status(200).render('Pages/employee-messages', {
                pageName: 'Employee Messages',
                pageTitle: 'TalentPool | Employee Message',
                userId,
                employeeUsers,
                data,
                profileImage: req.session.profileImage,
                firstName: req.session.firstName,
                role: req.session.data.userRole,
                path: '/employee/message',
                dashboardPath: `/employee/dashboard/${employeeId}`,
                profilePath: `/employee/profile/${employeeId}`,
                portfolioPath: `/employee/portfolio/${employeeId}`,
                error: req.flash('error'),
                errors: req.flash('errors'),
                success: req.flash('success'),
            });
        } catch (err) {
            console.log(err);
        }
    },


    chatMessages: async (req, res) => {
        try {
            const {
                senderID,
                receiverID
            } = req.params;
            const usersChatMessages = await model.Chat.findAll({
                raw: true,
                order: [
                    ['createdAt']
                ],
                where: {
                    [Op.or]: [
                        // eslint-disable-next-line max-len
                        {
                            [Op.and]: [{
                                user_id: senderID,
                            },
                            {
                                receiver_id: receiverID,
                            },
                            ],
                        },
                        {
                            [Op.and]: [{
                                user_id: receiverID,
                            },
                            {
                                receiver_id: senderID,
                            },
                            ],
                        },
                    ],
                },
            });

            return usersChatMessages;

        } catch (err) {
            console.log(err)
        }
    }
};