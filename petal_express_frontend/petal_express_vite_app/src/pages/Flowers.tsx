import { useEffect, useState } from "react";
import axios from "axios";

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
        const { data: response } = await axios.get(
          `http://localhost:${SERVER_PORT}/api/flowers`
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
        flowers && flowers.map((flower) => <p key={flower.id}>{flower.name}</p>)
      )}
    </>
  );
};

export default Flowers;
