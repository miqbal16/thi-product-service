const MongoClient = require("mongodb").MongoClient;
const slug = require('slugify');

async function seedCategory() {
    const uri = `mongodb://localhost:27017/product_service_db`;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        const collection = await client.db("product_service_db").collection("category_oleholehs");
        collection.drop(); 

        let dataCategory = [];
        let kategori_oleholeh = ["Kurma Manis", "Air zam-zam", "Coklat Arab", "Daging Unta"]
        let description_oleholeh = ["jual kurma manis harga murah", "jual air zam-zam asli dari mekkah","jual coklat asli dari arab", "jual daging unta segar dari arab"]

        for (let i = 0; i < 4; i++) {
            let newCategory = {
                category: kategori_oleholeh[i],
                description: description_oleholeh[i],
                slug: slug(kategori_oleholeh[i], {lower: true}),
                createdAt: new Date("2021-07-12T14:25:28.733Z"),
                updatedAt: new Date("2021-07-12T14:25:28.733Z"),
                __v: 0
            }

            dataCategory.push(newCategory);
        }
        await collection.insertMany(dataCategory);
        console.log("Database seeded!");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
seedCategory()