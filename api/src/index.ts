import express from "express";
import contactsRoutes from "./routes/contacts";
import rolesRoutes from "./routes/roles";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000", "http://localhost:5173"];

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use("/contacts", contactsRoutes);
app.use("/roles", rolesRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
