import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateFrontendAuth } from "../utils/auth";

const useAuth = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const valid = validateFrontendAuth();

    if (!valid) {
      localStorage.clear();
      navigate("/", { replace: true });
    } else {
      setIsAuth(true);
    }

    setChecking(false);
  }, [navigate]);

  return { isAuth, checking };
};

export default useAuth;
