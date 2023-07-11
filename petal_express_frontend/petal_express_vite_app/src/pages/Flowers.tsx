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
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    const fetchFlowersData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: response } = await axios.get(
          `${SERVER_PORT}/api/flowers`,
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

  useEffect(() => {
    const fetchLoginUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: response } = await axios.get(
          `${SERVER_PORT}/api/auth`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setLoggedInUser(response.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLoginUserData();
  }, []);

  

  return (
    <>
      <h1>Welcome to Petal Express! {loggedInUser}</h1>
      {flowers && flowers.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="flowers">
          {
            flowers && flowers.map((flower) =>
              <li key={flower._id}>
                <div className="flower">
                  <Link to={'/flower/' + flower.f_id}>
                    <img className="flower-image" src={`/images/flowers-${flower.f_id}.jpg`} alt="flower" />
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
