function fetchModel(url) {

  return fetch(
    `https://tf5pw3-8081.csb.app/api${url}`,
    {
      credentials: "include"
    }
  )
    .then((response) => {

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      return response.json();
    });
}

export default fetchModel;