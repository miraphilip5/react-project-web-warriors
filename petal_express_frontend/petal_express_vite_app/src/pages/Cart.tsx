import { useState } from "react";
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
  id: string;
  name: string;
  count: number;
  price: number;
}

interface CartProps {
  items: FlowerItem[];
  onDelete: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onReduceQuantity: (id: string) => void;
}

const Cart = ({}: CartProps) => {

  const [flowerItems, setFlowerItems] = useState([
    { "_id": "64869e3d5c469c1141654376", "name": "Jasmine", "count": 3, "price": 5.99 },
    { "_id": "64888d644e141ffe29700718", "name": "Sun flower", "count": 2, "price": 3.99 },
    { "_id": "648696e55c469c1141654368", "name": "Rose", "count": 1, "price": 7.99 },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setFlowerItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const handleIncreaseQuantity = (id: string) => {
    setFlowerItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            count: item.count + 1,
          };
        }
        return item;
      })
    );
  };

  const handleReduceQuantity = (id: string) => {
    setFlowerItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === id) {
            const updatedCount = item.count - 1;
            if (updatedCount >= 0) {
              return {
                ...item,
                count: updatedCount,
              };
            }
          }
          return item;
        })
        .filter((item) => item.count !== 0)
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    flowerItems.forEach((item) => {
      totalPrice += item.count * item.price;
    });
    return totalPrice.toFixed(2); // toFixed(2) ensures the total price is rounded to 2 decimal places
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const flowers = flowerItems.map((item) => ({
        id: item._id,
        name: item.name,
        quantity: item.count,
        price: item.price,
      }));
      await axios.post( `${SERVER_PORT}/api/orders`, {
        flowers
      },{
        headers: {
          Authorization: token,
        },
      });
      // Reset the cart or perform any other necessary actions
      setSnackbarOpen(true);
      setFlowerItems([]);
      navigate("/orders"); 
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div style={{marginTop:"10rem"}}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "darkgrey", color: "#fff" }}>Flower Name</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "darkgrey", color: "#fff" }}>Count</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "darkgrey", color: "#fff" }}>Price</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "darkgrey", color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flowerItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.count}</TableCell>
                  <TableCell align="center">{item.price}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="Reduce Quantity"
                      onClick={() => handleReduceQuantity(item._id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Increase Quantity"
                      onClick={() => handleIncreaseQuantity(item._id)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDelete(item._id)}
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
            Total Price: ${calculateTotalPrice()} $
            &nbsp;
            <Button
              variant="contained"
              sx={{ backgroundColor: "#9C27B0" }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Typography>
        </TableContainer>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Order Placed
          </Alert>
        </Snackbar>
    </div>
  );
};
export default Cart;
