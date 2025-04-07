
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that resets scroll position when navigating to a new route
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the page whenever the path changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
