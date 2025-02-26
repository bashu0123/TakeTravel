"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "../../../../public/Assets";
import { usePathname, useRouter } from "next/navigation";
import TourGuideModal from "@/components/ui/TourGuideModal";
import axios from "axios";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Use localStorage to immediately set userRole from token if available
  useEffect(() => {
    const token = localStorage.getItem("take-travel-token");
    if (token) {
      const getUser = async () => {
        try {
          const response = await axios.get("http://localhost:8000/users/me", {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          setUserRole(response.data.data.doc.role);
          setUserName(response.data.data.doc.name || "");
        } catch (error) {
          console.error(error);
          setUserRole(null); // In case of error, set to null
        }
      };
      getUser();
    } else {
      setUserRole(null); // No token, reset user role
    }
  }, [pathname, router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Links based on user role
  const Links = [
    ...(userRole === "admin"
      ? [
          { name: "Admin Dashboard", link: "/admin/dashboard" },
          { name: "Control Panel", link: "/admin/control-panel" },
        ]
      : []),
    ...(userRole === "user" || userRole === null
      ? [
          { name: "Home", link: "/" },
          { name: "Explore", link: "/explore" },
          { name: "About", link: "/about-us" },
          { name: "Contact Us", link: "/contact-us" },
          { name: "Nearby places", link: "/nearby-place" },
        ]
      : []),
    ...(userRole === "guide"
      ? [{ name: "Guide Dashboard", link: "/guide-dash" }]
      : []),
    ...(userRole === "user"
      ? [{ name: "My Bookings", link: "/my-bookings" }]
      : []),
  ];

  // Logout handler
  const logout = () => {
    localStorage.removeItem("take-travel-token");
    localStorage.removeItem("take-travel-userId");
    setUserRole(null); // Immediately update the state on logout
    router.push("/");
  };

  // If the user is on the '/auth' page, return null to avoid rendering the header
  if (pathname === "/auth") return null;

  return (
    <div>
      <nav className="bg-bg-gray-100 w-full">
        <div className="flex flex-wrap items-center py-2 sm:py-0 flex-col sm:flex-row justify-between max-w-screen-xl px-4 mx-auto">
          <Link href="/">
            <Image
              src={ASSETS.logo}
              alt="travel the world"
              height={170}
              width={170}
            />
          </Link>
          <div className="flex items-center gap-x-4 ml-2 mt-2 sm:mt-0 sm:gap-x-4 sm:ml-0 lg:order-2">
            <div className="hidden mt-2 mr-4 sm:inline-block">
              <span></span>
            </div>
            {userRole === "user" ||
              (userRole === null && (
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="bg-white border-2 border-orange-600 text-orange-600 transition-all hover:ring-4 hover:ring-orange-200 font-medium rounded-3xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 focus:outline-none"
                >
                  Become a Guide
                </button>
              ))}
            {userRole && userName ? (
              <div className="flex items-center gap-3">
                <div
                  onClick={logout}
                  className="cursor-pointer bg-orange-600 border-2 border-gray-100 text-white transition-all hover:ring-4 hover:ring-orange-400 font-medium rounded-3xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
                >
                  Logout
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold text-lg shadow-md border-2 border-white hover:scale-105 transition-transform duration-200">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-orange-600 border-2 border-gray-100 text-white transition-all hover:ring-4 hover:ring-orange-400 font-medium rounded-3xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
              >
                Login / Signup
              </Link>
            )}

            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu-2"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "hidden" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {Links.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="block py-2 font-semibold pl-3 pr-4 text-black rounded lg:bg-transparent lg:hover:text-orange-400 lg:p-0"
                    aria-current="page"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Tour Guide Registration Modal */}
      <TourGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}

export default Header;
