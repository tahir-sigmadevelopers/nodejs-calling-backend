import express, { urlencoded } from "express";
import userRoutes from "./routes/user.js";
import { ErrorMiddlerware } from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
const app = express();

// using Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(fileUpload());
// using Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/v1/user", userRoutes);
// api Routes -- Home Page
app.get("/", (req, res) => {
  res.send("<h1>Hello World, Server is Working😀😎😍.<h1/>");
});

// using ErrorMiddlerware
app.use(ErrorMiddlerware);

export default app;
