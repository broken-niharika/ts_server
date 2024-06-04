// Importing module
import express, { query } from 'express';
import { Client } from 'pg';
// import { ulid } from 'ulid';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
const port:Number=9000;
const DATABASE_URL: string = "postgresql://niharikareddy_broken:1bmcNFty8AE0cyV9EH8S-g@niha-cluster-7499.g8z.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full";
const get_client = () => {
	return new Client({ connectionString: DATABASE_URL });
}




// Handling GET / Request
app.get('/', (req, res) => {

    res.send('Welcome to typescript backend!');

   
})

app.get('/users',async (req,res) => {
	const errors 		= 	[] ;
	const query = `select id,name,age from users;`;
	const client = get_client();
	client.connect()
	try{
		const results = await client.query(query);
		const r = results;
		client.end();
        console.log("data fetched successfully");
		console.log(r)
        res.send(r.rows)
		return{success:true,r};
	}
	catch(err) {
		const m = "error executing  selct the query";
		errors.push(m)
		console.warn(m)
		client.end()
		return {success: false,errors}
		
	}

})


// app.post('/add', async(req,res) => {
//     const client = get_client();
// 	const errors = [];
// 	const {id,task,deadline} = req.body;
// 	console.log("task",task,"deadline",deadline,"id",id);
// 	const query = `INSERT INTO new_list(id,task, deadline) values('${id}','${task}',${deadline})`;
	
// 	client.connect()
// 	try {
		
// 		const results = await client.query(query);
// 		const d = results.rows;
// 		client.end();
// 		console.log('DATA INSERTED SUCCESSFULLY : ', d);
// 		res.send(d);
// 	} catch (err) {
// 		const m = "error insert  executing query:"+ err;
// 		console.warn(m);
// 		errors.push(m);
// 		client.end();
// 	}

// })

app.post('/update_user', async(req,res) => {
	const client = get_client()
	
	// const id = req.body.id
	// const new_name = req.body.name
	// const new_age = req.body.age
	// const query = `update users set name=${new_name},age=${new_age} where id=${id}`
	// got error while executing update query->error: at or near "=": syntax error
	
	const { id, name, age } = req.body;
    const query = `UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *`;
    const values = [name, age, id];
	client.connect() 
	
	try{
		const results = await client.query(query, values);
		const data = results.rows;
		console.log("values updated successfully ----->",data)
		client.end()
		res.send(data)

	} catch(err) {
		const m = "error while executing update query->"+err;
		console.warn(m)
		client.end()
	}


     
	
}  )



// Server setup


app.listen(port,() => {
    console.log('The application is listening '
          + 'on port http://localhost:'+port);
})




