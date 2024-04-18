import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavigationLinks from "./NavigationLinks";
import "./index.css";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  const navBarHeight = "50px";
  const sidebarWidth = "250px";
  return (
    <div>
      <div
        className="d-flex flex-column d-md-none position-fixed"
        style={{
          zIndex: "100",
          inset: "0px",
          justifyContent: "stretch",
          pointerEvents: "none",
        }}
      >
        <div
          className="cc-nav-bar d-flex align-items-center"
          style={{
            height: navBarHeight,
            pointerEvents: "auto",
            borderBottom: "1px solid var(--secondary-2)",
          }}
        >
          <button
            className="flex-shrink-0 d-flex align-items-center justify-content-center"
            onClick={() => setShowSidebar((show) => !show)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Link
            to="home"
            className="flex-shrink-1 d-flex align-items-center"
            style={{ minWidth: "0px" }}
          >
            <h1 style={{ minWidth: "0px" }}>Cinema Center</h1>
          </Link>
        </div>
        {showSidebar && (
          <div
            className="d-flex flex-grow-1 align-items-stretch h-100"
            style={{ pointerEvents: "auto" }}
          >
            <div
              className="flex-shrink-0 flex-grow-1 h-100"
              style={{ maxWidth: sidebarWidth, overflowY: "auto" }}
            >
              <NavigationLinks onClick={() => setShowSidebar(false)} />
            </div>
            <div
              className="bg-black opacity-25 flex-grow-1 flex-shrink-1"
              onClick={() => setShowSidebar(false)}
            ></div>
          </div>
        )}
      </div>
      <div className="d-block d-md-none" style={{ height: navBarHeight }} />
      <div className="d-flex">
        <div
          className="flex-shrink-0 d-none d-md-block position-fixed h-100"
          style={{
            width: sidebarWidth,
            borderRight: "1px solid var(--secondary-2)",
            overflowY: "auto",
          }}
        >
          <NavigationLinks />
        </div>
        <div
          style={{ width: sidebarWidth }}
          className="d-none d-md-block flex-shrink-0 flex-grow-0"
        />
        <div
          className="flex-shrink-1 flex-grow-1"
          style={{
            padding: "1.5rem",
            minWidth: "0px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
