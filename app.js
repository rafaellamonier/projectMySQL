import express from "express";
import mysql from "mysql2";
import { engine } from "express-handlebars";
import fileupload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Run fileUpload
app.use(fileupload());

// Manipulation of data by routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connection config
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "12345678",
	database: "projeto",
});

// Express handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Add Bootstrap
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

// Add CSS
app.use("/style", express.static("./views/style"));

// Test connection
connection.connect((error) => {
	if (error) throw error;

	console.log("Connection successful!");
});

// Main route
app.get("/", (req, res) => {
	res.render("formulario");
});

// Add product
app.post("/adicionar-produto", (req, res) => {
	// Add
	console.log("teste req", req.body);
	console.log("teste files", req.files.imageProduct.name);

	req.files.imageProduct.mv(
		`${__dirname}/images/${req.files.imageProduct.name}`,
	);

	res.end();
});

// List products
app.get("/products", (req, res) => {
	// products
	res.end();
});

console.log("Server running on: http://localhost:8080");

app.listen(8080);
