import { Router, Request, Response } from "express";
import pool from "../db.config";
import { Role } from "schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ["Roles"]
    #swagger.summary = "Get all roles"
  */
  try {
    const query = {
      text: "SELECT * FROM roles",
      values: [],
    };
    const response = await pool.query(query);
    const roles = response.rows.map((row) => {
      const result = Role.safeParse(row);
      if (!result.success) {
        res.status(400).send(result.error.message);
        return;
      }
      return result.data;
    });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;
