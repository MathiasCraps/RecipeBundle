async function fetchGraphQL<DataType>(text: string): Promise<DataType> {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text
      }),
    });
  
    const responseAsJson : { data: DataType } = await response.json();
    return responseAsJson.data;
  }
  
  export default fetchGraphQL;