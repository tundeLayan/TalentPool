const model = require('../../Models');
const {errorResMsg,successResMsg} = require('../../Utils/response');
const faqModel = model.Faq;
const faqCategory = model.FaqCategory;
const sequelize = model.sequelize;
exports.createFaq = async (req,res) => {
    console.log(req.body)
    try {
        const {
        category_id,
        question,
        answer
        } = req.body;
        const faq = {
            FaqCategoryId:category_id,
            question,
            answer,
            userId: "62686950-cce5-496f-9343-9bbc857e2977"
        }
        const faqInstance = await faqModel.create(faq);
        return successResMsg(res,200, "FAQ created successfully");
    } catch (error){
        return errorResMsg(res,500,error);
    }

}

exports.getFaq = async (req,res) => {
    try{    
        const allFaq = await faqModel.findAll({
            attributes : ['question','answer']
        });
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
        await faqModel.update({
            FaqCategoryId:category_id,
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
        await faqModel.destroy({
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

async function isBlocked(id){
    try{
        const state = faqModel.findOne({
            raw:true,
            where : {
                id
            },
            attributes: ['blocked']
        })
        return state;
    } catch (error){
        return errorResMsg(res,500,"An error occurred while getting state of FAQ!")
    }
    
}

exports.toggleBlockedFaq = async (req,res) => {
    try{
        const {id} = req.body;
        let faqState = (await (isBlocked(id))).blocked;
        faqState = (faqState==1)?0:1;
        await faqModel.update({
            blocked: faqState
        }, { where:{ 
            id
        }})
        return successResMsg(res,200,"FAQ block state toggled successfully!")
    } catch (error) {
        return errorResMsg(res,500,"An error occurred while blocking FAQ!");
    }

}

exports.addCategory = async (req, res) => {
    console.log(req.body)
    try {
        const { name } = req.body;
        await faqCategory.create( {
            name
        });
        return successResMsg(res,200,"Category added successfully!")
    } catch(error) {
        return errorResMsg(res,500, error);
    }

}


exports.searchFaq = async (req, res) => {
    console.log(req.body)
    try{
        const {searchKey} = req.body;
        const filterFaq = await sequelize.query("SELECT question,answer from Faqs where match(question,answer) against (:searchKey IN BOOLEAN MODE)",{
            replacements: {searchKey},
            type: sequelize.QueryTypes.SELECT
        })
        return successResMsg(res,200,filterFaq);
    }
    catch(error){
        return errorResMsg(res,500,"An error occurred while searching for FAQ");
    }
}