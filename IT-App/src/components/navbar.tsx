import { useEffect, useState, type FC } from "react";
import { UserToggle } from "../components/userToggle";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import { FaTags, FaStream, FaBoxOpen, FaUsers, FaList } from 'react-icons/fa'; // Ejemplo con FontAwesome

import { FaClone } from "react-icons/fa";




const ExampleNavbar: FC = function () {

  const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || '');


  useEffect(() => {
    localStorage.setItem('activeLink', activeLink);
  }, [activeLink]);

  const handleSetActiveLink = (link:any) => {
    setActiveLink(link);
  };


  return (

    <Navbar fluid rounded>
      <Navbar.Brand href="/" className=" mt-4 my-4 ml-8"> 
        <img alt="" src="/images/glass/logo.svg" className="mr-3 h-7 sm:h-12 dark:hidden" />
        <img alt="" src="/images/glass/logo.png" className="mr-3 h-7 sm:h-12 hidden dark:block" />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
      </Navbar.Brand>
      <div className="flex md:order-2 items-left gap-3 mr-4">
        <UserToggle />
        <DarkThemeToggle />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          href="/Category"
          className={`flex items-center space-x-2 ${activeLink === 'Category' ? 'bg-blue text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('Category')}
        >
          <FaTags className="mr-2" />
          <span>Asset</span>
        </Navbar.Link>
        <Navbar.Link
          href="/Brand"
          className={`flex items-center space-x-2 ${activeLink === 'Brand' ? 'bg-blue  text-primary-700  hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('Brand')}
        >
          <FaClone className="mr-2" />
          <span>Brand</span>
        </Navbar.Link>
        <Navbar.Link
          href="/Models"
          className={`flex items-center space-x-2 ${activeLink === 'Models' ? 'bg-blue  text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('Models')}
        >
          <FaStream className="mr-2" />
          <span>Models</span>
        </Navbar.Link>
        <Navbar.Link
          href="/Categories"
          className={`flex items-center space-x-2 ${activeLink === 'Categories' ? 'bg-blue text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('Categories')}
        >
          <FaList className="mr-2" />
          <span>Category</span>
        </Navbar.Link>
        <Navbar.Link
          href="/Inventory"
          className={`flex items-center space-x-2 ${activeLink === 'Inventory' ? 'bg-blue text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('Inventory')}
        >
          <FaBoxOpen className="mr-2" />
          <span>Inventory</span>
        </Navbar.Link>
        <Navbar.Link
          href="/users"
          className={` flex items-center space-x-2 ${activeLink === 'users' ? 'bg-blue  text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('users')}
        >
          <FaUsers className="mr-2" />
          <span>Users</span>
        </Navbar.Link>
        <Navbar.Link
          href="/reports"
          className={` flex items-center space-x-2 ${activeLink === 'reports' ? 'bg-blue  text-primary-700 hover:text-white font-extrabold hover:bg-blue-700 dark:bg-gray-800 dark:text-white border-b-2 border-transparent transition duration-200' : ''}`}
          onClick={() => handleSetActiveLink('reports')}
        >
          <FaBoxOpen className="mr-2" />
          <span>Reports</span>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

  );
};

export default ExampleNavbar;
