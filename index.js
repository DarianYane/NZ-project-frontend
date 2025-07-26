const App = () => {
  React.useEffect(() => {
    // Clear local storage on page load for a fresh start
    localStorage.removeItem("ticketImage");
    localStorage.removeItem("opinion");
    localStorage.removeItem("audio");
  }, []);

  const handleOpinionClick = () => {
    window.location.href = `${APP_CONFIG.pages.uploadOpinion}?mode=opinion_only`;
  };

  const handleLoginClick = () => {
    window.location.href = APP_CONFIG.pages.login;
  };

  return (
    <div className="d-flex flex-column vh-100">
      <main className="flex-grow-1 container d-flex justify-content-center align-items-center">
        <div className="text-center col-11 col-sm-8 col-md-6">
          <div className="px-md-5 mb-3">
            <h4 className="text-white w-50 mx-auto">
              Leave us your opinion on your last experience at
            </h4>
          </div>
          <div className="logo-placeholder">Your Logo</div>
          <p className="text-white-50 mb-custom-large">Point of sale address</p>
          <h2 className="mb-4">Want to share your opinion and get a reward?</h2>
          <div className="d-grid gap-3 px-md-5">
            <a
              id="opinionLink"
              href="#"
              onClick={handleOpinionClick}
              className="btn btn-outline-light btn-lg btn-attractive-base"
            >
              Just Give Opinion
            </a>
            <div className="glowing-button-wrapper">
              <a
                id="loginLink"
                href="#"
                onClick={handleLoginClick}
                className="btn btn-warning btn-lg fw-bold btn-attractive-base"
              >
                Opinion & My Prize!
              </a>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer text-center">
        powered by <span className="brand">FeedCounts</span>
      </footer>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
