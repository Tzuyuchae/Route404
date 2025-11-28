import React from "react";
import Layout from "../components/Layout";
import RecentlySaved from "../components/RecentlySaved";
import QuickSearch from "../components/QuickSearch";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { username } = useAuth();
  const userName = username || "User";

  return (
    <Layout>
      <div className="home-content">
        <h1 className="welcome-title">
          Welcome Back, {userName}
          <span className="emoji">✈️</span>
        </h1>

        <RecentlySaved />
        <QuickSearch />
      </div>
    </Layout>
  );
}
