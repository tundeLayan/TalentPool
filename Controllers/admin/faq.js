const model = require('../../Models');
const {errorResMsg,successResMsg} = require('../../Utils/response');

const faqModel = model.Faq;
const faqCategory = model.FaqCategory;
const {sequelize} = model;
exports.createFaq = async (req,res) => {
    console.log(req.body)
    try {
        const {
        categoryId,
        question,
        answer
        } = req.body;
        const faq = {
            FaqCategoryId:categoryId,
            question,
            answer,
            userId: "62686950-cce5-496f-9343-9bbc857e2977"
        }
        await faqModel.create(faq);
        return successResMsg(res,200, "FAQ created successfully");
    } catch (error){
        return errorResMsg(res,500,error);
    }

}

exports.getFaq = async (req,res) => {
    try{    
        await faqModel.findAll({
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
            categoryId,
            question,
            answer,
            id
        } = req.body;
        await faqModel.update({
            FaqCategoryId:categoryId,
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

async function isBlocked(req,res,id){
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
        let faqState = (await (isBlocked(req,res,id))).blocked;
        faqState = (faqState===1)?0:1;
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

exports.deleteCategory = async(req,res) => {
    try{
        const {categoryId} = req.body;
        await faqCategory.destroy({
            where : {
                id:categoryId
            },
            force:true
        })
        return successResMsg(res,200,"Category deleted successfully!")
    } catch(error){
        return errorResMsg(res,500,"An error occurred while deleting category!");
    }
}

exports.updateCategory = async(req, res) => {
    try{
        const {
            categoryId,
            name
        } = req.body;
        await faqCategory.update({
            name
        },{
            where:{
                id:categoryId
            }
        })
        return successResMsg(res,200,"FAQ category updated successfully!");
    } catch (error) {
        return errorResMsg(res,500,"An error occurred while updating category!");
    }
}