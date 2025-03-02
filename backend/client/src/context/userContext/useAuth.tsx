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

  const navigate = useNavigate();
  const location = useLocation();

  // Clear error on route change
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname, error]);

  // On mount, attempt to get user from the server
  useEffect(() => {
    getUser()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
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
          if (data.user) {
            setUser(data.user);
            setMessage(data.message);
            setTimeout(() => {
              setMessage(undefined);
              navigate("/users/login");
            }, 2000);
          } else {
            setError(data.error || "Registration failed");
          }
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
          if (data.success) {
            // store token in localStorage
            if (data.token) {
              localStorage.setItem("authToken", data.token);
            }
            setUser({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            });
            setMessage(data.message);
            setTimeout(() => {
              setMessage(undefined);
              navigate("/users/my-account");
            }, 2000);
          } else {
            setError(data.error || "Login failed");
          }
        })
        .catch((err) => setError(err?.message || String(err)))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  const logout = useCallback(() => {
    logoutUser().then((data) => {
      // remove token from localStorage
      localStorage.removeItem("authToken");

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
