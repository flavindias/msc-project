import { event } from "react-ga";

export const useAnalyticsEventTracker = (category = "Default category") => {
  const eventTracker = (action = "test action", label = "test label") => {
    event({ category, action, label });
  };
  return eventTracker;
};
