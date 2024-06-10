import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [searchString, setSearchString] = useState("")
  const [products, setProducts] = useState<Array<Schema["Product"]>>([]);

  useEffect(() => {
    console.log(client);
    
  }, []);

  function search() {
    client.queries.search(searchString)
  }

  async function addProduct() {
    const product = await client.mutations.addProduct();
    console.log(product);
  }

  return (
    <main>
      <h1>My todos</h1>
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
  );
}

export default App;
