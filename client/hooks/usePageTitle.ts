import { useContext, useEffect } from "react";
import { AppContext } from "../App";

export default function usePageTitle(pageTitle: string | null) {
  const { setPageTitle } = useContext(AppContext);
  // set page title on mount
  useEffect(() => {
    setPageTitle(pageTitle);
    return () => {
      setPageTitle(null);
    };
  }, [setPageTitle, pageTitle]);
}
