import { useAuth } from "../context/AuthContext";

function AuthDebug() {
  const { authState } = useAuth();

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h5>Auth State Debug</h5>
      </div>
      <div className="card-body">
        <pre className="mb-0">{JSON.stringify(authState, null, 2)}</pre>
      </div>
    </div>
  );
}

export default AuthDebug;
