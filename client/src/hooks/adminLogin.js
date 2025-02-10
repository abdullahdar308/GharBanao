const loginAdmin = async ({ email, password }) => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    console.log("Response from server:", data); // Log to inspect the response

    if (res.status === 200) {
      if (data.user.role === "admin") {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        return data.user;
      } else {
        throw new Error("Access denied. Admins only.");
      }
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    message.error(error.message);
    return null;
  }
};
