import { useState, useEffect } from "react"
import axios from "axios";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SERVER_PORT } from "../config";

import './Orders.css';

interface Flower {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string,
  orderId: string;
  flowers: Flower[];
  status: string;
}
interface OrdersProps {
  orders: Order[];
}

const Orders = ({}: OrdersProps) => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Make a GET request to fetch the orders from the API endpoint
        const response = await axios.get(`${SERVER_PORT}/api/orders`,{
          headers: {
            Authorization: token,
          },
        });
        
        // Set the retrieved orders data to the component state
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);

  const handleCancel = async(orderId: string) => {
    try {
      // Make a PUT request to the cancel order API endpoint
      await axios.put(`${SERVER_PORT}/api/orders/${orderId}/cancel`, null, {
        headers: {
          Authorization: token,
        },
      });
      
      // Update the status of the canceled order locally
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return { ...order, status: "Cancelled" };
          }
          return order;
        })
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleRemove = async(orderId: string) => {
    try {
      // Make a DELETE request to the remove order API endpoint
      await axios.delete(`${SERVER_PORT}/api/orders/${orderId}`,{
        headers: {
          Authorization: token,
        },
      });
      
      // Remove the deleted order from the local orders state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error removing order:", error);
    }
  };

  const calculateTotalPrice = (flowers: Flower[]) => {
    let totalPrice = 0;
    flowers.forEach((flower) => {
      totalPrice += flower.quantity * flower.price;
    });
    return totalPrice.toFixed(2);
  };

  return (
    <div className="orders-page">
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1">No orders available</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <ListItem key={order.orderId} className="order-item">
              <ListItemText
                primary={`Order ID: ${order.orderId}`}
                secondary={
                  <List className="flower-list">
                    {order.flowers.map((flower) => (
                      <ListItem key={flower.id} className="flower-item">
                        <ListItemText
                          primary={flower.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" component="span">
                                Quantity: {flower.quantity}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                Price: ${flower.price} $
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                }
              />
              &nbsp;<ListItemText primary={`Status: ${order.status}`} className="status-column"  /> 
              <ListItemText primary={` Order Total: ${calculateTotalPrice(order.flowers)} $`} className="status-column"  />
              {order.status !== "Complete" && order.status !== "Cancelled" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancel(order._id)}>
                  Cancel Order
                </Button>
              )}
              {(order.status == "Complete" ||  order.status == "Cancelled" ) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRemove(order._id)}>
                  Remove Order
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Order Update Success
          </Alert>
        </Snackbar>
    </div>
  );
};

export default Orders;
