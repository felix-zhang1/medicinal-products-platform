import Supplier from "../models/supplier.model.js";
import User from "../models/user.model.js";
import {
  saveImageFromBuffer,
  saveImageFromUrl,
} from "../services/image.service.js";

class SupplierController {
  constructor() {}

  // 返回当前用户（supplier 或 admin）的供应商；admin 可传 owner_user_id 查询（可选）
  async me(req, res) {
    try {
      const ownerId =
        req.user.role === "admin" && req.query.owner_user_id
          ? Number(req.query.owner_user_id)
          : req.user.id;
      const supplier = await Supplier.findOne({
        where: { owner_user_id: ownerId },
      });
      if (!supplier)
        return res
          .status(404)
          .json({ error: "Supplier not found for current user" });
      res.status(200).json(supplier);
    } catch (error) {
      console.error("Get supplier me error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  }

  // create a supplier
  async createSupplier(req, res) {
    try {
      // get 前端填写的用户资料(在verifyToken.js中被解析出来了)
      const requester = req.user;

      const {
        name,
        description,
        image_url,
        address, // 原始用户输入
        place_id,
        formatted_address,
        lat,
        lng,
        address_components, // JSON 字符串
        owner_user_id,
      } = req.body;

      const trimmedName = (name || "").trim();
      if (!trimmedName) {
        return res.status(400).json({ error: "Supplier name is required" });
      }

      let ownerId = null;

      if (requester.role === "supplier") {
        // 供应商自己建：强制绑定为自己；且最多一条
        ownerId = requester.id;

        const exists = await Supplier.findOne({
          where: { owner_user_id: ownerId },
        });
        if (exists) {
          return res.status(409).json({ error: "Supplier already exists" });
        }
      } else if (requester.role === "admin") {
        // 管理员可以为任意用户创建
        if (!owner_user_id) {
          return res
            .status(400)
            .json({ error: "owner_user_id is required for admin" });
        }
        ownerId = Number(owner_user_id);

        // （可选）校验用户是否存在
        const user = await User.findByPk(ownerId);
        if (!user) {
          return res.status(404).json({ error: "Target user not found" });
        }

        const exists = await Supplier.findOne({
          where: { owner_user_id: ownerId },
        });
        if (exists) {
          return res
            .status(409)
            .json({ error: "Supplier already exists for this user" });
        }
      } else {
        // 其它角色不允许
        return res.status(403).json({ error: "Forbidden" });
      }

      // 对经纬度数据进行校验
      let latNum = null,
        lngNum = null,
        comps = null;
      if (lat !== undefined && lat !== null && String(lat).trim() !== "") {
        latNum = Number(lat);
        if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
          return res.status(400).json({ error: "Invalid latitude" });
        }
      }
      if (lng !== undefined && lng !== null && String(lng).trim() !== "") {
        lngNum = Number(lng);
        if (Number.isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
          return res.status(400).json({ error: "Invalid longitude" });
        }
      }
      if (address_components) {
        try {
          comps = JSON.parse(address_components);
        } catch {
          return res
            .status(400)
            .json({ error: "address_components must be JSON" });
        }
      }

      const newSupplier = await Supplier.create({
        name: trimmedName,
        description: description ?? null,
        image_url: image_url ?? null,
        address: address ?? null,
        place_id: place_id ?? null,
        formatted_address: formatted_address ?? null,
        lat: latNum,
        lng: lngNum,
        address_components: comps ? JSON.stringify(comps) : null,
        owner_user_id: ownerId,
      });

      res.status(201).json(newSupplier);
    } catch (error) {
      console.error("Supplier creation error", error);
      res.status(500).json({ error: "Failed to create supplier" });
    }
  }

  // get all suppliers
  async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.findAll();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  }

  // get a supplier by id
  async getSupplierById(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json(supplier);
    } catch (error) {
      console.error("Fetch supplier by id error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  }

  // delete a supplier by id
  async deleteSupplierById(req, res) {
    try {
      const { id } = req.params;
      const deletedCount = await Supplier.destroy({ where: { id } });
      if (deletedCount === 0) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      console.error("Supplier deletion error:", error);
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  }

  // update a supplier by id
  async updateSupplierById(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        image_url,
        address,
        place_id,
        formatted_address,
        lat,
        lng,
        address_components,
      } = req.body;

      let payload = {
        name,
        description,
        image_url,
        address,
        place_id,
        formatted_address,
      };
      if (lat !== undefined && String(lat).trim() !== "") {
        const v = Number(lat);
        if (Number.isNaN(v) || v < -90 || v > 90) {
          return res.status(400).json({ error: "Invalid latitude" });
        }
        payload.lat = v;
      }
      if (lng !== undefined && String(lng).trim() !== "") {
        const v = Number(lng);
        if (Number.isNaN(v) || v < -180 || v > 180) {
          return res.status(400).json({ error: "Invalid longitude" });
        }
        payload.lng = v;
      }
      if (address_components !== undefined) {
        if (address_components === null || address_components === "") {
          payload.address_components = null;
        } else {
          try {
            JSON.parse(address_components);
            payload.address_components = address_components;
          } catch {
            return res
              .status(400)
              .json({ error: "address_components must be JSON" });
          }
        }
      }

      const [updatedCount] = await Supplier.update(payload, { where: { id } });

      if (updatedCount === 0) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier updated successfully" });
    } catch (error) {
      console.error("Supplier update error:", error);
      res.status(500).json({ error: "Failed to update supplier" });
    }
  }
}

export default new SupplierController();
