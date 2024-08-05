import React from "react";
import axios from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/notificationPage.css"

const NotificationPage = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`/notifications/find/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched notifications:", response.data);
        setNotifications(response.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/notifications/accept",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally update the state or refetch notifications
      setNotifications((prev) =>
        prev.filter((notification) => notification.booking !== bookingId)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/notifications/reject",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally update the state or refetch notifications
      setNotifications((prev) =>
        prev.filter((notification) => notification.booking !== bookingId)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div className="notification-page">
        <Navbar/>
      <div className="notifications">
        <h1>Notifications</h1>
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li key={notification._id}>
              {notification.message}
              {notification.type === "bookingRequest" && (
                <div>
                  <button onClick={() => handleAccept(notification.booking)}>
                    Accept
                  </button>
                  <button onClick={() => handleReject(notification.booking)}>
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Footer/>
    </div>
  );
};

export default NotificationPage;
