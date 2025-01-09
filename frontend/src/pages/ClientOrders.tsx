import ClientOrdersTable from "@/components/ClientOrdersTable";
import Navbar from "@/components/Navbar";
import apiClient from "@/lib/apiClient";
import { useUserStore } from "@/store";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

const ClientOrders = () => {
  const { user } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const response = await apiClient.get(`/orders/user/${user.id}`);
          setOrders(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchOrders();
  }, [user]);

  if (orders.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <ClientOrdersTable orders={orders} />
    </div>
  );
};

export default ClientOrders;
