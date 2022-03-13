import express, {
    Application,
    Response as ExResponse,
    Request as ExRequest,
    NextFunction
} from "express";
import morgan from "morgan";
//import Router from "./routes";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import { ObtainResponseErrorJSON } from "./models/obtainResponseErrorJSON";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

// Build swagger api docs
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

RegisterRoutes(app);

app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
//    console.log("ERROR",err);
    if (err instanceof ObtainResponseErrorJSON) {
        return res.status(422).json({
            message: err.message,
            details: err?.details,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

export default app;