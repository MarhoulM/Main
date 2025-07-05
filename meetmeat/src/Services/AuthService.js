const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Funkce pro registraci uživatele
const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Username: username, Email: email, Password: password}),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data)); 
      return { success: true, message: "Registrace úspěšná a přihlášeno!", data };
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Registrace se nezdařila.", errors: errorData.errors || errorData };
      } else {
        const textError = await response.text();
        return { success: false, message: textError || `Registrace se nezdařila (Status: ${response.status}).` };
      }
    }
  } catch (error) {
    console.error("Chyba při volání registrace API:", error);
    return { success: false, message: "Síťová chyba nebo neočekávaná chyba." };
  }
};

const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Username: username, Email: "", Password: password }),
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                localStorage.setItem("user", JSON.stringify(data));
                return { success: true, message: "Přihlášení úspěšné!", data };
            } else {
                const textData = await response.text();
                localStorage.setItem("user", JSON.stringify({ token: textData })); 
                return { success: true, message: textData || "Přihlášení úspěšné!" };
            }
        } else {
             const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Přihlášení se nezdařilo.", errors: errorData.errors || errorData };
      } else {
        const textError = await response.text();
        return { success: false, message: textError || `Přihlášení se nezdařilo (Status: ${response.status}).` };
      }
        }
    } catch (error) {
        console.error("Chyba při volání přihlášení API:", error);
        return { success: false, message: "Síťová chyba nebo neočekávaná chyba." };
    }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
