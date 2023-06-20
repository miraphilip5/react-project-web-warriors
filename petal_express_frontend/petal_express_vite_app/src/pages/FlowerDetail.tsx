import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_PORT } from "../config";
import { Link } from "react-router-dom";

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
    const [qty, setQty] = useState<string>('1');

    useEffect(() => {

        const fetchFlowerData = async () => {
    
          try {
    
            const token = localStorage.getItem("token");
    
            console.log("The token at front end is " + token);
    
            const { data: response } = await axios.get(
    
              `http://localhost:${SERVER_PORT}/api/flowers/${f_id}`,
    
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

    

    //to be updated
    const handleAddToCart = () =>{

    }

    return (
        <>
            <div className="back-to-home">
                <Link to="/flowers">Back to HomePage</Link>
            </div>
            {flower ?
                (
                    <div className="details">
                        <div className="details-image">
                            <img src={"/images/flowers-1.jpg"} alt="flowerDetail" ></img>
                        </div>
                        <div className="details-info">
                            <ul>
                                <li>
                                    <h4>{flower.name}</h4>
                                </li>
                                <li>
                                    {flower.category}
                                </li>
                                <li>
                                    <b>${flower.price}</b>
                                </li>
                                <li>
                                    Description:
                                    <div>
                                        {flower.description}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="details-action">
                            <ul>
                                <li>
                                    Price:<b>{flower.price}</b>
                                </li>
                                <li>
                                    Status: {flower.stock > 0 ? 'In Stock' : 'Unavailable'}
                                </li>
                                <li>
                                    Qty: <select value={qty} onChange={(e) => { setQty(e.target.value) }}>
                                        {[...Array(flower.stock).keys()].map(x =>
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                                    </select>
                                </li>
                                <li>
                                    {flower.stock > 0 && <button onClick={handleAddToCart} className="button">Add to Cart</button>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )
            }

        </>)

    //return "hello";
}

export default FlowerDetail;