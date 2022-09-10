const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
exports.create = async (req, res, next) => {
  if(!req.body?.name){
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactServices = new ContactService(MongoDB.client);
    const document = await contactServices.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the cantact")
    );
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactServices = new ContactService(MongoDB.client);
    const { name } = req.query;
    if(name){
      documents = await contactServices.findByName(name);
    }else{
      documents =await contactServices.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the cantact")
    );
  }
  return res.send(documents);
}
exports.findOne = async (req, res, next) => {
  try {
    const contactServices = new  ContactService(MongoDB.client);
    const document = await contactServices.findById(req.params.id);
    if(!document){
      return next(new ApiError(404, "Contact nt found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieing contact with id=${req.params.id}`)
    );
  }
},
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0){
    return next (new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const contactServices = new ContactService(MongoDB.client);
    const document= await contactServices.update(req.params.id, req.body);
    if(!document){
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Contact was update successfully"});
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieing contact with id=${req.params.id}`)
    );
  }
},
exports.delete = async (req, res, next) => {
  try {
    const contactServices = new ContactService(MongoDB.client);
    const document = await contactServices.delete(req.params.id);
    if(!document){
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Contact was deleted successfully"});
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieing contact with id=${req.params.id}`)
    );
  }
},
exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactServices = new ContactService(MongoDB.client);
    const documents = await contactServices.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the cantact")
    );
  }
},
exports.deleteAll = async (_req, res, next) => {
  try {
    const contactServices = new ContactService(MongoDB.client);
    const deletedCount = await contactServices.deleteAll();
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the cantact")
    );
  }
}