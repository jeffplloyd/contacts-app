import { Router, Request, Response } from "express";
import pool from "../db.config";
import { Contact, ListContact } from "schema";
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
    const response = await pool.query(query);
    const contacts = response.rows.map((row) => {
      const result = Contact.safeParse(row);
      if (!result.success) {
        res.status(400).send(result.error.message);
        return;
      }
      return result.data;
    });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/list", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Contacts list']
    #swagger.summary = 'Get all contacts for contact list with total count'
  */
  try {
    const { orderBy, orderDirection } = req.query;
    const query = {
      text: `SELECT c.id, c.fname, c.lname, r.name AS role, c.is_favorite FROM contacts c LEFT JOIN roles r ON c.role_id = r.id ORDER BY ${orderBy ?? "fname"} ${orderDirection ?? "ASC"}`,
      values: [],
    };
    const countQuery = {
      text: "SELECT COUNT(*) FROM contacts",
      values: [],
    };
    const response = await pool.query(query);
    const countResponse = await pool.query(countQuery);
    const totalCount = countResponse.rows[0].count;
    const contacts = response.rows.map((row) => {
      const result = ListContact.safeParse(row);
      if (!result.success) {
        res.status(400).send(result.error.message);
        return;
      }
      return result.data;
    });
    res.json({
      data: contacts,
      totalCount,
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
      text: "SELECT c.*, r.name AS role FROM contacts c LEFT JOIN roles r ON c.role_id = r.id WHERE c.id = $1",
      values: [id],
    };
    const response = await pool.query(query);
    if (response.rowCount === 0) {
      res.status(404).send("Person not found");
      return;
    }
    const person = response.rows[0];
    const result = Contact.safeParse(person);
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

router.post("/", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Create contact'
  */
  try {
    const body = {
      ...req.body,
      dob: new Date(req.body.dob),
    };
    const result = Contact.safeParse(body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const { fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone, role_id } = body;
    const query = {
      text: "INSERT INTO contacts (fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone, role_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      values: [
        sanitizedInput(fname),
        sanitizedInput(lname),
        sanitizedInput(dob.toISOString().split("T")[0]),
        sanitizedInput(website),
        sanitizedInput(personal_email),
        sanitizedInput(personal_phone),
        sanitizedInput(work_email),
        sanitizedInput(work_phone),
        role_id,
      ],
    };
    const response = await pool.query(query);
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Update contacts by id'
  */
  try {
    const body = {
      ...req.body,
      dob: new Date(req.body.dob),
      updated_at: new Date(),
    };
    const result = Contact.safeParse(body);
    if (!result.success) {
      res.status(400).send(result.error.message);
      return;
    }
    const id = parseInt(req.params.id, 10);
    const {
      fname,
      lname,
      dob,
      website,
      personal_email,
      personal_phone,
      work_email,
      work_phone,
      is_favorite,
      role_id,
      updated_at,
    } = body;
    const query = {
      text: "UPDATE contacts SET fname = $1, lname = $2, dob = $3, website = $4, personal_email = $5, personal_phone = $6, work_email = $7, work_phone = $8, is_favorite = $9, role_id = $10, updated_at = $11 WHERE id = $12 RETURNING *",
      values: [
        sanitizedInput(fname),
        sanitizedInput(lname),
        sanitizedInput(dob.toISOString().split("T")[0]),
        sanitizedInput(website),
        sanitizedInput(personal_email),
        sanitizedInput(personal_phone),
        sanitizedInput(work_email),
        sanitizedInput(work_phone),
        is_favorite,
        sanitizedInput(role_id),
        updated_at,
        id,
      ],
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

router.put("/favorite/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Update favorite status by id'
  */
  try {
    const id = parseInt(req.params.id, 10);
    const query = {
      text: "UPDATE contacts SET is_favorite = NOT is_favorite WHERE id = $1 RETURNING *",
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

router.delete("/:id", async (req: Request, res: Response) => {
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
