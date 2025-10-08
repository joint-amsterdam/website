// ScrollManager.js
import { useEffect } from 'react';
import { withRouter } from 'react-router';

function ScrollManager({ history, children }) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return children;
}

export default withRouter(ScrollManager);
