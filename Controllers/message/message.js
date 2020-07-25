/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const Sequelize = require('sequelize');
const model = require('../../Models/index');
const { employerChatUsers, employeeChatUsers } = require('../dao/db-queries');
const { renderPage } = require('../../Utils/render-page');

const {
    Op
} = Sequelize;



module.exports = {

    employerMessagePage: async (req, res) => {
        const employeeChatUsersResult = await employeeChatUsers(req, res);

        const employerUsers = [...employeeChatUsersResult];
        renderPage(res, 'employer/employerMessagePage', employerUsers, 'TalentPool | Employer Message', '/employer/message')
    },

    employeeMessagePage: async (req, res) => {

        const employerChatUsersResult = await employerChatUsers(req, res);

        const employeeUsers = [...employerChatUsersResult];
        renderPage(res, 'employee/employeeMessagePage', employeeUsers, 'TalentPool | Employee Message', '/employee/message')

    },


    chatMessages: async (req, ) => {
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
                            userId: senderID,
                        },
                        {
                            receiverId: receiverID,
                        },
                        ],
                    },
                    {
                        [Op.and]: [{
                            userId: receiverID,
                        },
                        {
                            receiverId: senderID,
                        },
                        ],
                    },
                ],
            },
        });

        return usersChatMessages;
    }
};
