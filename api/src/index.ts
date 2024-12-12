import express from "express";
import peopleRoutes from "./routes/people";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.254.144:5173',
];

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use("/people", peopleRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;