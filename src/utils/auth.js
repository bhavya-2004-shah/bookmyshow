export const validateFrontendAuth = () => {
  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const fingerprint = localStorage.getItem("authFingerprint");

  if (!token || !expireAt || !fingerprint || isAuthenticated !== "true") {
    return false;
  }

  // ⏰ Expiry check
  if (Date.now() / 1000 > Number(expireAt)) {
    return false;
  }

  // 🧪 Fingerprint integrity check
  try {
    const decoded = JSON.parse(atob(fingerprint));
    if (decoded.length !== token.length) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
