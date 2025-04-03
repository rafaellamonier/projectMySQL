import express from "express";
import mysql from "mysql2";
import { engine } from "express-handlebars";
import fileupload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
dotenv.config();

// Run fileUpload
app.use(fileupload());

// Manipulation of data by routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connection config
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
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
});

// Main route
app.get("/", (req, res) => {
	res.render("home");
});

// Add product
app.post("/adicionar-produto", (req, res) => {
	// Get data of register product
	const nameProduct = req.body.nameProduct;
	const valueProduct = req.body.valueProduct;
	const imageProduct = req.files.imageProduct.name;

	// SQL
	const sql = `
		INSERT INTO 
			produtos (nome, valor, imagem) 
		VALUES 
			(
				'${nameProduct}', 
				'${valueProduct}', 
				'${imageProduct}'
			)`;
	const queryViewTable = `SELECT * FROM produtos`;

	// SQL command
	connection.query(sql, (error, returnQuery) => {
		if (error) throw error;

		req.files.imageProduct.mv(
			`${__dirname}/images/${req.files.imageProduct.name}`,
		);
	});

	// View table - [test]
	connection.query(queryViewTable, (error, returnQuery) => {
		if (error) throw error;
	});

	// redirect main route
	res.redirect("/");
});

// List products
app.get("/products", (req, res) => {
	const queryViewTable = `SELECT * FROM produtos`;
	connection.query(queryViewTable, (error, returnQuery) => {
		if (error) throw error;
		console.log(returnQuery);

		// const jsonProducts = res.json(returnQuery);
		res.render("products", {
			products: returnQuery,
		});
	});
});

console.log("Server running on: http://localhost:3004");

app.listen(3004);
