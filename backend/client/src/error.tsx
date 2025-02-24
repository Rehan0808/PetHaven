import { useRouteError } from "react-router-dom";
import { Navbar } from "./navBar";

// Define a more flexible error type
interface PetErrorType {
  status?: number;
  data?: {
    message: string;
  };
  message?: string;
}

export const ErrorPage = () => {
  const error = useRouteError();
  let title = "An error occurred.";
  let message = "Something went wrong.";
  
  console.log("Error type:", typeof error);
  console.log("Error object:", error);
  
  // Safe error handling with type checking
  if (error && typeof error === 'object') {
    const typedError = error as PetErrorType;
    
    if (typedError.status === 500 && typedError.data?.message) {
      message = typedError.data.message;
    } else if (typedError.message) {
      message = typedError.message;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  return (
    <>
      <Navbar />
      <h1>{title}</h1>
      <p>{message}</p>
    </>
  );
};