/* eslint-disable import/prefer-default-export */
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import SubCategoryModel from "../models/subCategoryModel.js";
import { ApiError } from "../utils/classes/apiError.js";
import { ApiFeatures } from "../utils/classes/apiFeatures.js";

export const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

/**
 * @description create subCategory
 * @route       POST /api/v1/subcategories
 * @access      private
 */
export const createSubCategory = asyncHandler(async (req, res) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

/**
 * @description get a specific subCategory
 * @route GET /api/v1/subcategories/:id
 * @access
 */
export const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) {
    return next(new ApiError(`No subCategory found with this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

export const createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};
/**
 * @description get list of subCategories
 * @route GET /api/v1/subcategories/:id
 * @access
 */
export const getSubCategories = asyncHandler(async (req, res) => {

  const documentsCount = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .selectFields()
    .sort();

  // 7 ) excute the query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res
    .status(200)
    .json({ paginationResult, results: subCategories.length, data: subCategories });
});

/**
 * @description update a specific subCategory
 * @route PATCH /api/v1/subcategories/:id
 * @access
 */
export const updateSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subcategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subcategory) {
    return next(new ApiError(`No subCategory found with this id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

/**
 * @description delete a specific subCategory
 * @route PATCH /api/v1/subcategories/:id
 * @access
 */
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findByIdAndDelete({ _id: id });
  if (!subcategory) {
    return next(new ApiError(`No subCategory found with this id ${id}`, 404));
  }
  res.status(204).send();
});
