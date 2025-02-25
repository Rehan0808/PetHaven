// src/context/userContext/useAuth.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} from "../../services/api";
import { AuthContextType, User, AuthMessage, RegisterUser, LoginUser } from "../../types";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [message, setMessage] = useState<AuthMessage>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Because AuthProvider is inside RouterProvider, these hooks work now
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname, error]);

  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch((_error) => {})
      .finally(() => setLoadingInitial(false));
  }, []);

  const register = useCallback(
    (newUser: RegisterUser) => {
      setLoading(true);
      setError(undefined);
      registerUser(newUser)
        .then((data) => {
          setUser(data.user);
          setMessage(data.message);
          setTimeout(() => {
            setMessage(undefined);
            navigate("/users/login");
          }, 2000);
        })
        .catch((err) => setError(err?.message || String(err)))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  const login = useCallback(
    (loginUserData: LoginUser) => {
      setLoading(true);
      setError(undefined);
      loginUser(loginUserData)
        .then((data) => {
          setUser(data.user);
          setMessage(data.message);
          setTimeout(() => {
            setMessage(undefined);
            navigate("/users/my-account");
          }, 2000);
        })
        .catch((err) => setError(err?.message || String(err)))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  const logout = useCallback(() => {
    logoutUser().then((data) => {
      setUser(undefined);
      setMessage(data.message);
      setTimeout(() => {
        setMessage(undefined);
        navigate("/");
      }, 2000);
    });
  }, [navigate]);

  const memoedValue = useMemo(
    () => ({
      user,
      message,
      error,
      loading,
      register,
      login,
      logout,
    }),
    [user, message, error, loading, register, login, logout]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
