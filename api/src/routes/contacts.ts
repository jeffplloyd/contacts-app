import { Router, Request, Response } from "express";
import pool from "../db.config";
import { Contact, ContactWithId } from "schema";
import { sanitizedInput } from "../utils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Get all contacts'
  */
  try {
    const { orderBy, orderDirection } = req.query;
    const query = {
      text: `SELECT * FROM contacts ORDER BY ${orderBy ?? "fname"} ${orderDirection ?? "ASC"}`,
      values: [],
    };
    const countQuery = {
      text: "SELECT COUNT(*) FROM contacts",
      values: [],
    };
    const response = await pool.query(query);
    const countResponse = await pool.query(countQuery);
    const totalCount = countResponse.rows[0].count;
    const people = response.rows.map((row) => {
      const result = ContactWithId.safeParse(row);
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
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Get constact by id'
  */
  try {
    const id = parseInt(sanitizedInput(req.params.id), 10);
    const query = {
      text: "SELECT * FROM contacts WHERE id = $1",
      values: [id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Person not found");
      return;
    }
    const person = response.rows[0];
    const result = ContactWithId.safeParse(person);
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
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Create contact'
  */
  try {
    const result = Contact.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const { fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone, role_id } = req.body;
    const createdAt = new Date().toISOString();
    const query = {
      text: "INSERT INTO contacts (fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone, role_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      values: [sanitizedInput(fname), sanitizedInput(lname), sanitizedInput(dob), sanitizedInput(website), sanitizedInput(personal_email), sanitizedInput(personal_phone), sanitizedInput(work_email), sanitizedInput(work_phone), role_id, createdAt, createdAt],
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
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Update contacts by id'
  */
  try {
    const result = Contact.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const id = parseInt(req.params.id, 10);
    const { fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone } = req.body;
    const updateAt = new Date().toISOString();
    const query = {
      text: "UPDATE contacts SET fname = $1, lname = $2, dob = $3, website = $4, personal_email = $5, personal_phone = $6, work_email = $7, work_phone = $8, updated_at = $9 WHERE id = $10 RETURNING *",
      values: [sanitizedInput(fname), sanitizedInput(lname), sanitizedInput(dob), sanitizedInput(website), sanitizedInput(personal_email), sanitizedInput(personal_phone), sanitizedInput(work_email), sanitizedInput(work_phone) , updateAt, id ],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Contact not found");
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
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Delete contact by id'
  */
  try {
    const id = parseInt(sanitizedInput(req.params.id), 10);
    const query = {
      text: "DELETE FROM contacts WHERE id = $1 RETURNING *",
      values: [id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Contact not found");
      return;
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;