import { useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';


const client = generateClient<Schema>();

function App() {
  // const [searchString, setSearchString] = useState("")

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

  /*
  function search() {
    client.queries.search({query:searchString})
  }*/

  async function addProduct() {
    const promptString = "Generate a record for the following graphql schema. " + modelSchema
    const product = await client.mutations.addProduct({"query":promptString});
    console.log(product);
  }

  return (
    <Authenticator>
      {() => (
    <main>
      <h1>My Products</h1>
      <button onClick={addProduct}>Add Product</button>
    
    </main>
     )}
    </Authenticator>
  );
}

export default App;
