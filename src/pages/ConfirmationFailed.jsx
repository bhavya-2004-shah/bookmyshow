import { useSearchParams } from "react-router-dom";

const ConfirmationFailed = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-red-600 text-2xl font-bold">
        Payment Failed ❌ <br />
        Order ID: {orderId}
      </h1>
    </div>
  );
};

export default ConfirmationFailed;
