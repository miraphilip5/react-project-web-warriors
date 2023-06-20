import { useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

import './Orders.css';

interface Flower {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  flowers: Flower[];
  status: string;
}
interface OrdersProps {
  orders: Order[];
}

const Orders = ({}: /*orders*/ OrdersProps) => {
  const sampleOrders: Order[] = [
    {
      id: "1",
      flowers: [
        {
          id: "1",
          name: "Rose",
          quantity: 2,
          price: 10,
        },
        {
          id: "2",
          name: "Lily",
          quantity: 3,
          price: 8,
        },
      ],
      status: "Pending",
    },
    {
      id: "2",
      flowers: [
        {
          id: "3",
          name: "Tulip",
          quantity: 5,
          price: 5,
        },
      ],
      status: "Complete",
    },
  ];

  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const handleCancel = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const handleRemove = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
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
            <ListItem key={order.id} className="order-item">
              <ListItemText
                primary={`Order ID: ${order.id}`}
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
                                Price: ${flower.price}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                }
              />
              <ListItemText primary={`Status: ${order.status}`} className="status-column"  />
              {order.status !== "Complete" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancel(order.id)}>
                  Cancel Order
                </Button>
              )}
              {order.status == "Complete" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRemove(order.id)}>
                  Remove Order
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Orders;
