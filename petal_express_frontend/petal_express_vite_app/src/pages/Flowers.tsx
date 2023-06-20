import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { SERVER_PORT } from "../config";

interface FlowersProp {
  flowers: FlowerProp[];
}

interface FlowerProp {
  category: string;
  color: string;
  description: string;
  f_id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
  _id: string;
}

const Flowers = () => {
  const [flowers, setFlowers] = useState<FlowersProp>();
  useEffect(() => {

    const fetchFlowersData = async () => {

      try {

        const token = localStorage.getItem("token");

        console.log("The token at front end is " + token);

        const { data: response } = await axios.get(

          `http://localhost:${SERVER_PORT}/api/flowers`,

          {

            headers: {

              Authorization: `${token}`,

            },

          }

        );

        setFlowers(response);

      } catch (error) {

        console.error(error);

      }

    };

    fetchFlowersData();

  }, []);

  return (
    <>
      <h1>Welcome to Petal Express!</h1>
      {flowers && flowers.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="flowers">
          {
            flowers && flowers.map((flower) =>
              <li key={flower._id}>
                <div className="flower">
                  <Link to={'/flower/' + flower.f_id}>
                    <img className="flower-image" src={"/images/flowers-1.jpg"} alt="flower" />
                  </Link>
                  <div className="flower-name">
                    <Link to={'/flower/' + flower.f_id}>{flower.name}</Link>
                  </div>
                  <div className="flower-category">{flower.category}</div>
                  <div className="flower-price">${flower.price}</div>
                  <div className="flower-description">{flower.description} </div>
                </div>
              </li>)
          }
        </ul>
      )}
    </>
  );
};

export default Flowers;
