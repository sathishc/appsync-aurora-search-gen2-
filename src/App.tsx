import { useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';


const client = generateClient<Schema>({authMode:'apiKey'});

function App() {
  // const [searchString, setSearchString] = useState("")

  useEffect(() => {
    console.log(client);    
  }, []);

  
  function search() {
    client.queries.search({query:"Anker"})
  }


  return (
    <main>
      <h1>My Products</h1>
      <button onClick={search}>Add Product</button>
    
    </main>
  );
}

export default App;
