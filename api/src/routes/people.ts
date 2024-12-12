import { Router, Request, Response } from "express";
import pool from "../db.config";
import { Person, PersonWithId } from "scheme";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['People']
    #swagger.summary = 'Get all people'
    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              orderBy: {
                type: "string",
                example: "name"
              },
              orderDirection: {
                type: "string",
                example: "ASC"  
              }
            }
          }
        }
      }
    }
  */
  try {
    const { orderBy, orderDirection } = req.body;
    const query = {
      text: `SELECT * FROM people ORDER BY ${orderBy || "id"} ${orderDirection || "ASC"}`,
      values: [],
    };
    const countQuery = {
      text: "SELECT COUNT(*) FROM people",
      values: [],
    };
    const response = await pool.query(query);
    const countResponse = await pool.query(countQuery);
    const totalCount = countResponse.rows[0].count;
    const people = response.rows.map((row) => {
      const result = PersonWithId.safeParse(row);
      if (!result.success) {
        res.status(400).send(result.error.message);
        return;
      }
      return result.data;
    });
    res.json({
      data: people,
      totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['People']
    #swagger.summary = 'Get person by id'
  */
  try {
    const id = parseInt(req.params.id, 10);
    const query = {
      text: "SELECT * FROM people WHERE id = $1",
      values: [id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Person not found");
      return;
    }
    const person = response.rows[0];
    const result = PersonWithId.safeParse(person);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/", async(req: Request, res: Response) => {
  /*
    #swagger.tags = ['People']
    #swagger.summary = 'Create person'
  */
  try {
    const result = Person.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const { name, age } = req.body;
    const query = {
      text: "INSERT INTO people (name, age) VALUES ($1, $2) RETURNING *",
      values: [name, age],
    };
    const response = await pool.query(query);
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async(req: Request, res: Response) => {
  /*
    #swagger.tags = ['People']
    #swagger.summary = 'Update person by id'
  */
  try {
    const result = Person.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const id = parseInt(req.params.id, 10);
    const { name, age } = req.body;
    const query = {
      text: "UPDATE people SET name = $1, age = $2 WHERE id = $3 RETURNING *",
      values: [name, age, id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Person not found");
      return;
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async(req: Request, res: Response) => {
  /*
    #swagger.tags = ['People']
    #swagger.summary = 'Delete person by id'
  */
  try {
    const id = parseInt(req.params.id, 10);
    const query = {
      text: "DELETE FROM people WHERE id = $1 RETURNING *",
      values: [id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Person not found");
      return;
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;