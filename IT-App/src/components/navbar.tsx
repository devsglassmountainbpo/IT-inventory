import type { FC } from "react";
import { UserToggle } from "../components/userToggle";
import { DarkThemeToggle, Navbar, Button } from "flowbite-react";
import { FaTags, FaStream, FaBoxOpen, FaUsers, FaDesktop, FaList } from 'react-icons/fa'; // Ejemplo con FontAwesome

import { FaClone } from "react-icons/fa";




const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/" className="mr-4">
              <img alt="" src="/images/glass/logo.svg" className="mr-3 h-7 sm:h-12 dark:hidden" />
              <img alt="" src="/images/glass/logo.png" className="mr-3 h-7 sm:h-12 hidden dark:block" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              </span>
            </Navbar.Brand>
            <Navbar.Brand className="flex items-center space-x-4 text-lg">
              <Button href="/Category"  className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaTags className="mr-1" />
                <span>Asset</span>
              </Button>

              <Button href="/Brand"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaClone className="mr-2" />
                <span>Brand</span>
              </Button>
              <Button href="/Models"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaStream className="mr-2" />
                <span>Models</span>
              </Button>
              <Button href="/Categories"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaList className="mr-2" />
                <span>Category</span>
              </Button>
              <Button href="/Inventory"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaBoxOpen className="mr-2" />
                <span>Inventory</span>
              </Button>
              <Button href="ITinventory"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaDesktop className="mr-2" />
                <span>IT Inventory</span>
              </Button>
              <Button href="/users"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaUsers className="mr-2" />
                <span>Users</span>
              </Button>
              <Button href="/reports"
                className="bg-blue text-black  hover:text-white hover:bg-blue-700  dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200 flex items-center space-x-2"
              >
                <FaBoxOpen className="mr-2" />
                <span>Reports</span>
              </Button>
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            {/* <iframe
              height="30"
              src="https://ghbtns.com/github-btn.html?user=themesberg&repo=flowbite-react-admin-dashboard&type=star&count=true&size=large"
              title="GitHub"
              width="90"
              className="hidden sm:block"
            /> */}
            {/* <Button color="primary" href="https://hr.glassmountainbpo.com/ap/">
              Glass Mountain BPO
            </Button> */}
            <UserToggle />
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
