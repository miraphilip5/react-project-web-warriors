import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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

const Cart = ({ items, onDelete, onIncreaseQuantity }: CartProps) => {

  // const handleDelete = (id: string) => {
  //   onDelete(id);
  // };

  // const handleIncreaseQuantity = (id: string) => {
  //   onIncreaseQuantity(id);
  // };

  // const handleReduceQuantity = (id: string) => {
  //   onReduceQuantity(id);
  // };

  const [flowerItems, setFlowerItems] = useState([
    { id: '1', name: 'Rose', count: 3, price: 5.99 },
    { id: '2', name: 'Tulip', count: 2, price: 3.99 },
    { id: '3', name: 'Lily', count: 1, price: 7.99 },
  ]);

  const handleDelete = (id: string) => {
    setFlowerItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleIncreaseQuantity = (id: string) => {
    setFlowerItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
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
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedCount = item.count - 1;
          if (updatedCount >= 0) {
            return {
              ...item,
              count: updatedCount,
            };
          }
        }
        return item;
      }).filter((item) => item.count !== 0)
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    flowerItems.forEach((item) => {
      totalPrice += item.count * item.price;
    });
    return totalPrice.toFixed(2); // toFixed(2) ensures the total price is rounded to 2 decimal places
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flower Name</TableCell>
            <TableCell align="center">Count</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flowerItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="center">{item.count}</TableCell>
              <TableCell align="center">{item.price}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="Reduce Quantity" onClick={() => handleReduceQuantity(item.id)}>
                  <RemoveIcon />
                </IconButton>
                <IconButton aria-label="Increase Quantity" onClick={() => handleIncreaseQuantity(item.id)}>
                  <AddIcon />
                </IconButton>
                <IconButton aria-label="Delete" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" component="p" align="right" style={{ margin: '10px' }}>
        Total Price: ${calculateTotalPrice()}
      </Typography>
    </TableContainer>
  );
};

export default Cart;
