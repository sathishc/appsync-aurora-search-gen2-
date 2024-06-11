import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';


const client = generateClient<Schema>();

function App() {
  const [searchString, setSearchString] = useState("")
  const [products, setProducts] = useState<Array<Schema["Product"]>>([]);

  const modelSchema = `Product{
    product_id: a.string().required(),
    product_name: a.string().required(),
    category: a.string(),
    discounted_price: a.string(),
    actual_price: a.string(),
    discount_percentage: a.string(),
    rating: a.string(),
    rating_count: a.string(),
    about_product: a.string(),
  }`

  useEffect(() => {
    console.log(client);    
  }, []);

  function search() {
    client.queries.search(searchString)
  }

  async function addProduct() {
    const promptString = "Generate a record for the following graphql schema. " + modelSchema
    const product = await client.mutations.addProduct({"query":promptString});
    console.log(product);
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
    <main>
      <h1>My Products</h1>
      <button onClick={addProduct}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
     )}
    </Authenticator>
  );
}

export default App;
