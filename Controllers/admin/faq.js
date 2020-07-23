const model = require('../../Models');
const {errorResMsg,successResMsg} = require('../../Utils/response');
const faqModel = model.faq;
const faqCategory = model.FaqCategory;
exports.createFaq = async (req,res) => {
    try {
        const {
        category_id,
        question,
        answer
        } = req.body;
        const faq = {
            category_id,
            question,
            answer,
            userId: req.session.userId
        }
        const faqInstance = await faqModel.create(Faq);
        return successResMsg(res,200, "FAQ created successfully");
    } catch (error){
        return errorResMsg(res,500,"An error occurred while creating FAQs!");
    }

}

exports.getFaq = async (req,res) => {
    try{
        const allFaq = await faq.findAll({});
        return successResMsg(res,200,"FAQs fetched successfully!");
    } catch (error) {
        return errorResMsg(res,500,"An error occurred while fetching FAQs!");
    }

}

exports.updateFaq = async (req,res) => {
    try{
        const {
            category_id,
            question,
            answer,
            id
        } = req.body;
        await faq.update({
            category_id,
            question,
            answer
        },{ where: {
            id
        }})
        return successResMsg(res,200,"FAQ updated successfully!");
    } catch (error) {
        return errorResMsg(res,500,"An error occurred while updating FAQs");
    }
}

exports.deleteFaq = async (req,res) => {
    try{
        const {id} =req.body;
        await faq.destroy({
            where: {
                id
            },
            force:true
        })
        return successResMsg(res,200,"FAQ deleted successfully!");
    } catch(error){
        return errorResMsg(res,500, "An error occurred while deleting FAQ!");
    }

}

function getToggleState(id){
    const state = Faq.findOne({
        where : {
            id
        },
        attributes: ['blocked']
    })
    return state;
}

exports.toggleBlockedFaq = async (req,res) => {
    try{
        const {id} = req.body;
        const faqState = getToggleState(id);
        await Faq.update({
            blocked:faqState
        }, { where:{ 
            id
        }}
        )
    } catch (error) {
        return errorResMsg(res,500,"An error occurred while blocking FAQ!");
    }

}

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await faqCategory.create( {
            name
        });
    } catch {
        return errorResMsg(res,500, "An error occurred while adding new category!");
    }

}


exports.searchFaq = async (req, res) => {
    try{
        const {searchKey} = req.body;
        
    }
    catch(error){
        console.log("An error occurred while searching for FAQ");
    }
}