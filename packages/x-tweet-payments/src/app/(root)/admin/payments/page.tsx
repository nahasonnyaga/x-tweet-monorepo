import React, { useState, useEffect } from "react";
import { fetchPayments } from "@lib/payments";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      const data = await fetchPayments();
      setPayments(data);
      setLoading(false);
    };
    loadPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments Dashboard</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: any) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.user}</td>
              <td className="border px-4 py-2">${p.amount}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsPage;
