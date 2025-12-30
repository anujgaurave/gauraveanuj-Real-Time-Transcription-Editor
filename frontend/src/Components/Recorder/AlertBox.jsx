import React from "react";

export default function AlertBox({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert ${alert.type}`}>
      {alert.message}
    </div>
  );
}
