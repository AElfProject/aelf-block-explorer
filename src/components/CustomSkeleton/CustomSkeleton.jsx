import { Skeleton } from "antd";
import React from "react";

export default function CustomSkeleton({ children, loading }) {
  return (
    <Skeleton active loading={loading}>
      {children}
    </Skeleton>
  );
}
