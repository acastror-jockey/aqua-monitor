import { useState } from "react";
import { login } from "./services/api";
import "./index.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await login(email, password);

      // Admite las convenciones más habituales de JWT.
      const accessToken =
        data.access_token ||
        data.access ||
        data.data?.access_token ||
        data.data?.access;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      setResult(data);
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(
              responseData || {
                message: err.message || "No se pudo conectar con la API",
              },
              null,
              2
            )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="login-card">
        <div className="brand">
          <span className="brand-icon">A</span>
          <h1>AquaMonitor</h1>
        </div>

        <p className="subtitle">
          Inicia sesión para acceder al sistema.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="usuario@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Validando..." : "Iniciar sesión"}
          </button>
        </form>

        {error && (
          <div className="message error">
            <strong>Error de autenticación</strong>
            <pre>{error}</pre>
          </div>
        )}

        {result && (
          <div className="message success">
            <strong>Respuesta recibida de la API</strong>
            <p>
              {localStorage.getItem("access_token")
                ? "Token de acceso guardado en localStorage."
                : "La API respondió, pero no se encontró un token en las claves esperadas."}
            </p>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <button
  type="button"
  onClick={async () => {
    try {
      const user = await getCurrentUser();
      alert(JSON.stringify(user, null, 2));
    } catch (error) {
      alert(
        JSON.stringify(error.response?.data || error.message)
      );
    }
  }}
>
  Consultar mi usuario
</button>
      </section>
    </main>
  );
}

export default App;
