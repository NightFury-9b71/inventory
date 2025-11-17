"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  onFillDemo: () => void;
};

export default function DemoCredentialsCard({ onFillDemo }: Props) {
  return (
    <Card
      className="mb-6 bg-amber-50 border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
      onClick={onFillDemo}
    >
      <CardContent className="p-4">
        <p className="text-sm text-amber-800 font-medium mb-2">
          🚀 Demo Credentials (Click to fill):
        </p>
        <p className="text-xs text-amber-700">username: admin</p>
        <p className="text-xs text-amber-700">Password: password</p>
      </CardContent>
    </Card>
  );
}
