import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { SERVER_PORT } from "../config";

interface FlowerItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  f_id: number;
}

interface CartProps {
  items: FlowerItem[];
  onDelete: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onReduceQuantity: (id: string) => void;
}

const Cart = ({}: CartProps) => {
  const [flowerItems, setFlowerItems] = useState<FlowerItem[]>([]);
  //useState([
  // { "_id": "64869e3d5c469c1141654376", "name": "Jasmine", "count": 3, "price": 5.99 },
  // { "_id": "64888d644e141ffe29700718", "name": "Sun flower", "count": 2, "price": 3.99 },
  // { "_id": "648696e55c469c1141654368", "name": "Rose", "count": 1, "price": 7.99 },
  // ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        // Make a GET request to fetch the orders from the API endpoint
        const response = await axios.get(`${SERVER_PORT}/api/carts`, {
          headers: {
            Authorization: token,
          },
        });

        // Set the retrieved orders data to the component state
        setFlowerItems(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchFlowers();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`${SERVER_PORT}/api/carts/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    setFlowerItems((prevItems) => prevItems.filter((item) => item.f_id !== id));
  };

  const handleIncreaseQuantity = async (id: number) => {
    await axios.put(
      `${SERVER_PORT}/api/carts/${id}/increase`,
      { operation: "increase" },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setFlowerItems((prevItems) =>
      prevItems.map((item) => {
        if (item.f_id === id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      })
    );
  };

  const handleReduceQuantity = async (id: number) => {
    await axios.put(
      `${SERVER_PORT}/api/carts/${id}/reduce`,
      { operation: "reduce" },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setFlowerItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.f_id === id) {
            const updatedCount = item.quantity - 1;
            if (updatedCount >= 0) {
              return {
                ...item,
                quantity: updatedCount,
              };
            }
          }
          return item;
        })
        .filter((item) => item.quantity !== 0)
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    flowerItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    return totalPrice.toFixed(2); // toFixed(2) ensures the total price is rounded to 2 decimal places
  };

  const handlePlaceOrder = async () => {
    try {
      const flowers = flowerItems.map((item) => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      await axios.post(
        `${SERVER_PORT}/api/orders`,
        {
          flowers,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      emptyCart();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const emptyCart = async () => {
    try {
      await axios.delete(
        `${SERVER_PORT}/api/carts`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Reset the cart or perform any other necessary actions
      setSnackbarOpen(true);
      setFlowerItems([]);
      navigate("/orders");
    } catch (error) {
      console.error("Error emptying cart", error);
    }
  }

  return (
    <div style={{ marginTop: "10rem" }}>
      {flowerItems.length === 0 ? (
        <Typography variant="body1">Shopping cart empty!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "darkgrey", color: "#fff" }}>
                  Flower Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "darkgrey", color: "#fff" }}
                >
                  Count
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "darkgrey", color: "#fff" }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "darkgrey", color: "#fff" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flowerItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{item.price}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="Reduce Quantity"
                      onClick={() => handleReduceQuantity(item.f_id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Increase Quantity"
                      onClick={() => handleIncreaseQuantity(item.f_id)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDelete(item.f_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography
            variant="h6"
            component="p"
            align="right"
            style={{ margin: "20px" }}
          >
            Total Price: ${calculateTotalPrice()} &nbsp;
            <Button
              variant="contained"
              sx={{ backgroundColor: "#9C27B0" }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Typography>
        </TableContainer>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Order Placed
        </Alert>
      </Snackbar>
    </div>
  );
};
export default Cart;
