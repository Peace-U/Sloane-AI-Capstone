import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { createOrder } from "../services/PaymentService"

const Success = () => {
  const [searchParam] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const sessionId = searchParam.get("session_id"); // grab the stripe session id from the query param in URL
  useEffect(()  => {
    async function handleCreateOrder(id) {
        try {
            const data = await createOrder(id);
            setOrderDetails(data);
        } catch (error) {
            console.log(error);
        }
    }
    if(sessionId) {
        handleCreateOrder(sessionId);
    }
  }, [sessionId]);
  return (
    <div>
        {orderDetails && (
            <>
            <h2>Payment was successful</h2>
            <p>Here are the order details</p>
            <p>{orderDetails.orderNumber}</p>
            <p>Total price of the order: {orderDetails.totalPrice}</p>
            </>
        )}
    </div>
  )
}

export default Success