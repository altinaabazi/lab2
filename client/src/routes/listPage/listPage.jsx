// import "./listPage.scss";
//  import Filter from "../../components/filter/Filter";
//  import Card from "../../components/card/Card";
//  import Map from "../../components/map/Map";
// import { listData } from "../../lib/dummydata";
 
//  function ListPage() {
//    const data = listData;
//    return <div className="listPage">
//    <div className="listContainer">
//    <div className="wrapper">
//     <Filter/>
//     {data.map(item => (
//         <Card key = {item.id} item={item}/>

//     ))}





//    </div>
//    </div>

// <div className="mapContainer">
//     <Map items={data}/>
// </div>
//    </div>
//  }
//  export default ListPage;

import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { useEffect, useState } from "react";
import axios from "axios";

function ListPage() {
  const [data, setData] = useState([]);  // Për të mbajtur të dhënat nga backend
  const [loading, setLoading] = useState(true);  // Për të menaxhuar ngarkimin

  // Përdor useEffect për të marrë të dhënat kur komponenti ngarkon
  useEffect(() => {
    // Bëjmë kërkesë për të marrë të dhënat
    axios
      .get("http://localhost:8800/api/posts")  // Vendosni URL-në e API-së tuaj
      .then((response) => {
        setData(response.data);  // Vendosim të dhënat në state
        setLoading(false);  // Ndaluam ngarkimin
      })
      .catch((error) => {
        console.error("Ka ndodhur një gabim gjatë marrjes së të dhënave:", error);
        setLoading(false);  // Përsëri ndalojmë ngarkimin edhe në rast gabimi
      });
  }, []);  // Ky useEffect do të ekzekutohet vetëm një herë kur komponenti ngarkon

  if (loading) {
    return <div>Loading...</div>;  // Shfaqim një mesazh ngarkimi ndërkohë që presim të dhënat
  }

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {data.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mapContainer">
        <Map items={data} />
      </div>
    </div>
  );
}

export default ListPage;
