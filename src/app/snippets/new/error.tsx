"use client";

import { FC } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const error: FC<ErrorPageProps> = ({ error }) => {
  return <div>{error.message}</div>;
};

export default error;
