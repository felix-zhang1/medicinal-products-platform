import Category from "../models/category.model.js";

class CategoryController {
  // create category
  async createCategory(req, res) {
    try {
      const { name, parent_id, level } = req.body;

      // inspect name
      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      // inspect parent_id
      let formattedParentId = null;
      if (parent_id != null) {
        const numParentId = Number(parent_id);
        if (Number.isNaN(numParentId)) {
          return res
            .status(400)
            .json({ error: "parent_id must be a valid number" });
        }
        formattedParentId = numParentId;
      }

      // create parameters for Create method
      const categoryData = {
        name,
        parent_id: formattedParentId,
      };

      // inspect level, if the value of level is null and undefined, the sequelize will use the default value (1)
      if (level != null) {
        const numLevel = Number(level);
        if (Number.isNaN(numLevel)) {
          return res
            .status(400)
            .json({ error: "level must be a valid number" });
        }
        categoryData.level = numLevel;
      }

      const category = await Category.create(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Category creation error:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  }

  // get all categories
  async getAllCategories(req, res) {
    try {
      const { level, parent_id } = req.query;

      // create an empty "where" object to store query conditions 
      const where = {};

      // check if the "level" field is provided and ensure it is a valid number
      if (level != null) {
        const numLevel = Number(level);
        if (Number.isNaN(numLevel)) {
          return res
            .status(400)
            .json({ error: "level must be a valid number" });
        }
        where.level = numLevel;
      }

      // Check if the "parent_id" field is provided and ensure it is a valid number
      if (parent_id != null) {
        const numPid = Number(parent_id);
        if (Number.isNaN(numPid)) {
          return res
            .status(400)
            .json({ error: "parent_id must be a valid number" });
        }
        where.parent_id = numPid;
      }

      const categories = await Category.findAll({
        where,
        order: [["id", "ASC"]],
      });
      res.status(200).json(categories);
    } catch (error) {
      console.error("Fetch categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  // get by id
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category)
        return res.status(404).json({ error: "Category not found" });
      res.status(200).json(category);
    } catch (error) {
      console.error("Fetch category by id error:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  }

  // update
  async updateCategoryById(req, res) {
    try {
      const { id } = req.params;
      const { name, parent_id, level } = req.body;
      const [count] = await Category.update(
        { name, parent_id, level },
        { where: { id } }
      );
      if (count === 0)
        return res.status(404).json({ error: "Category not found" });
      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      console.error("Category update error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  }

  // delete
  async deleteCategoryById(req, res) {
    try {
      const { id } = req.params;
      const count = await Category.destroy({ where: { id } });
      if (count === 0)
        return res.status(404).json({ error: "Category not found" });
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Category deletion error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  }

  // fetch all root categories (level 1) along with their direct subcategories, ordered by ID
  async getCategoryTree(req, res) {
    try {
      const roots = await Category.findAll({
        where: { level: 1 },
        attributes: ["id", "name", "level", "parent_id"],
        include: [
          {
            model: Category,
            as: "subcategories",
            attributes: ["id", "name", "level", "parent_id"],
            required: false,
          },
        ],
        order: [
          ["id", "ASC"],
          [{ model: Category, as: "subcategories" }, "id", "ASC"],
        ],
      });
      res.json(roots);
    } catch (error) {
      console.error("getCategoryTree error:", error);
      res.status(500).json({ error: "Failed to get category tree" });
    }
  }
}

export default new CategoryController();
