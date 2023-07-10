import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_PORT } from "../config";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

const FlowerDetail = () => {
  const { f_id } = useParams();
  const [flower, setFlower] = useState<FlowerProp | null>(null);
  const [qty, setQty] = useState<string>("1");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchFlowerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: response } = await axios.get(
          `${SERVER_PORT}/api/flowers/${f_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setFlower(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFlowerData();
  }, [f_id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${SERVER_PORT}/api/cart/add`,
        {
          flowerId: flower?._id,
          quantity: parseInt(qty),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Handle the response here, such as displaying a success message or updating the cart state
      console.log("Item added to cart:", response.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <>
       {flower ? (
        <div className="details">
          <div className="details-image">
            <img
              src={`/images/flowers-${flower.f_id}.jpg`}
              alt="flowerDetail"
            ></img>
          </div>
          <div className="details-info">
            <ul>
              <li>
                <h4>{flower.name}</h4>
              </li>
              <li>{flower.category}</li>
              <li>
                <b>${flower.price}</b>
              </li>
              <li>
                Description:
                <div>{flower.description}</div>
              </li>
            </ul>
          </div>
          <div className="details-action">
            <ul>
              <li>
                Price: <b>{flower.price} $</b>
              </li>
              <li>Status: {flower.stock > 0 ? "In Stock" : "Unavailable"}</li>
              <li>
                Qty:{" "}
                <select
                  value={qty}
                  onChange={(e) => {
                    setQty(e.target.value);
                  }}
                >
                  {[...Array(flower.stock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                {flower.stock > 0 && (
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#9C27B0" }}
                    onClick={handleAddToCart}
                    className="button"
                  >
                    Add to Cart
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
        Flower added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};

export default FlowerDetail;
