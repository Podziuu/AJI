import Dropdown from "@/components/Dropdown";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnfulfilledOrdersTable from "@/components/UnfulfilledOrdersTable";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [unfulfilledOrders, setUnfulfilledOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
        setOrders(response.data);
        setUnfulfilledOrders(
          response.data.filter(
            (order: Order) => order.status.name === "PENDING"
          )
        );
      } catch (err) {
        console.log("Error fetching orders", err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await apiClient.get("/status");
        setStatuses(response.data);
      } catch (err) {
        console.log("Error fetching statuses", err);
      }
    };

    fetchOrders();
    fetchStatuses();
  }, []);

  if (orders.length === 0 || statuses.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Tabs defaultValue="unfulfilledOrders" className="m-8">
        <TabsList>
          <TabsTrigger value="unfulfilledOrders">
            Unfulfilled orders
          </TabsTrigger>
          <TabsTrigger value="allOrders">All orders</TabsTrigger>
        </TabsList>
        <TabsContent value="unfulfilledOrders">
          <UnfulfilledOrdersTable orders={unfulfilledOrders} showActions />
        </TabsContent>
        <TabsContent value="allOrders">
          <Dropdown
            label="Status"
            options={statuses}
            selected={selectedStatus}
            onSelect={setSelectedStatus}
          />
          <UnfulfilledOrdersTable
            orders={orders}
            selectedStatus={selectedStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
