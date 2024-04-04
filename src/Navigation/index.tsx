import { FaBars } from "react-icons/fa";
import "./index.css";
import NavigationLinks from "./navigationLinks";
import "./index.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  const navBarHeight = "50px";
  return (
    <div className="h-100">
      <div
        className="cc-nav-bar d-absolute d-md-none"
        style={{ height: navBarHeight }}
      >
        <button
          className="flex-shrink-0"
          onClick={() => setShowSidebar((show) => !show)}
        >
          <FaBars />
        </button>
        <Link
          to="home"
          className="flex-shrink-1 d-flex align-items-center"
          style={{ minWidth: "0px" }}
        >
          <h1 style={{ minWidth: "0px" }}>Cinema Center</h1>
        </Link>
      </div>
      <div className="d-block d-md-none" style={{ height: navBarHeight }}></div>
      <div className="h-100 d-flex align-items-stretch">
        <div
          className={`position-absolute ${
            showSidebar ? "d-block" : "d-none"
          } d-md-none h-100 w-100 d-flex`}
          style={{ zIndex: 1 }}
        >
          <div className="flex-shrink-0">
            <NavigationLinks onClick={() => setShowSidebar(false)} />
          </div>
          <div
            className="bg-black flex-grow-1 flow-shrink-1 w-100"
            onClick={() => setShowSidebar(false)}
            style={{ opacity: "15%" }}
          ></div>
        </div>
        <div className="flex-shrink-0 d-none d-md-block">
          <NavigationLinks />
        </div>
        <div className="flex-shrink-1 flex-grow-1" style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
