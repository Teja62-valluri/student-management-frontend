function LoadingSpinner({ message = "Loading data..." }) {
  return (
    <div className="loading-overlay">
      <div className="text-center">
        <div
          className="spinner-border"
          role="status"
          style={{ width: 40, height: 40, borderWidth: 3 }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 14, marginBottom: 0 }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
