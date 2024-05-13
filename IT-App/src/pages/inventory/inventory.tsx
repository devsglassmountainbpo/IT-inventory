/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Button,
    // Checkbox,
    Label,
    Modal,
    Select,
    Table,
    TextInput,
  
  } from "flowbite-react";
  import type { FC } from "react";
  import { useEffect, useState, SetStateAction } from "react"
  import {
    // HiChevronLeft,
    // HiChevronRight,
    HiRefresh,
    HiDocumentDownload,
    // HiOutlinePencilAlt,
    HiPlus,
    HiOutlinePencilAlt
  } from "react-icons/hi";
  import { FaCheck, FaTimes } from "react-icons/fa"
  import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
  import axios from "axios";
  import { FiletypeCsv, FiletypeXlsx } from 'react-bootstrap-icons';
  import { useSearchParams } from 'react-router-dom';
  import { Checkbox as FlowbiteCheckbox } from 'flowbite-react';
  import { useNavigate } from 'react-router-dom';
  
  
  import CryptoJS from "crypto-js";
  
  import * as XLSX from 'xlsx';

  import { Dropdown } from "flowbite-react";

  
  const created_user3 = localStorage.getItem("badgeSession") || "";
  const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
  const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");
  
  const userLevel3 = localStorage.getItem("userLevel") || "";
  const userLevel2 = (userLevel3 ? CryptoJS.AES.decrypt(userLevel3, "Tyrannosaurus") : "");
  const userLevel = (userLevel2 ? userLevel2.toString(CryptoJS.enc.Utf8) : "");
  
  const Cards: FC = function () {
    const [searchParams] = useSearchParams();
    const account = searchParams.get('account');
    const [data, setData] = useState([] as any[]);
    const [originalData, setOriginalData] = useState<any[]>([]);
    let [filteredResults, setFilteredResults] = useState([] as any[]);
    let [sortByName, setSortByName] = useState(false);
    let [sortbyPosition, setSortByPosition] = useState(false);
    let [sortByDepartment, setSortByDeparment] = useState(false);
    let [sortByStatus, setSortByStatus] = useState(false);
    let [dataTemp, setDataTemp] = useState([] as any[]);
    // let checkboxRef = useRef<HTMLInputElement>(null);
    // const [checkBoxes, setCheckBoxes] = useState(false);
    const checkboxArray: string[] = [];
    const [sharedState, setSharedState] = useState(false);
  
    const updateSharedState = (newValue: boolean) => {
      // resetCheckboxes();
      setSharedState(newValue);
    }
  
    useEffect(() => {
      axios.get('https://bn.glassmountainbpo.com:8080/inventory/stock')
        .then(res => {
          if (userLevel === '2') {
            // Filter data where supervisorBadge equals created_user
            const filteredData = res.data.filter((item: { supervisorBadge: string; }) => item.supervisorBadge === created_user);
            setData(filteredData);
            setOriginalData(filteredData);
          } else {
            // If userLevel is not 2, set data as is
            setData(res.data);
            setOriginalData(res.data);
          }
        })
    }, [sharedState, userLevel, created_user]); // Add userLevel and created_user to the dependency array
  
    const [searchInput, setSearchInput] = useState('');
    const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
      setSearchInput(e.target.value);
    };
  
    useEffect(() => {
      if (account) {
        setSearchInput(account)
      }
    }, [account])
  
    function goodDisplay(dateString: string): string {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    }
  
    useEffect(() => {
      if (searchInput !== '') {
        const foo = data;
        let filteredRawData = foo.filter((user) => {
          return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
        })
        if (sortByName === true) {
          filteredRawData = filteredRawData.sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase()) ? 1 : -1);
        }
        if (sortbyPosition === true) {
          filteredRawData = filteredRawData.sort((a, b) => (a.status > b.status) ? 1 : -1);
        }
        if (sortByDepartment === true) {
          filteredRawData = filteredRawData.sort((a, b) => (a.badge > b.badge) ? 1 : -1);
        }
        if (sortByStatus === true) {
          filteredRawData = filteredRawData.sort((a, b) => (a.value > b.value) ? 1 : -1);
        }
        setFilteredResults(filteredRawData);
        // resetCheckboxes();
      } else {
        let foo = data;
        if (sortByName === true) {
          foo = foo.sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase()) ? 1 : -1);
        }
        if (sortbyPosition === true) {
          foo = foo.sort((a, b) => (a.status > b.status) ? 1 : -1);
        }
        if (sortByDepartment === true) {
          foo = foo.sort((a, b) => (a.badge > b.badge) ? 1 : -1);
        }
        if (sortByStatus === true) {
          foo = foo.sort((a, b) => (a.value > b.value) ? 1 : -1);
        }
        setDataTemp(foo);
      }
    }, [searchInput, sortByName, sortbyPosition, sortByDepartment, sortByStatus, dataTemp, data]);
  
    const handleSortClick = (e: any, header: string) => {
      // resetCheckboxes();
      if (e) {
        if (header === "name") {
          if (sortByName === false) {
            setSortByPosition(false);
            setSortByDeparment(false);
            setSortByStatus(false);
            setSortByName(true);
          } else {
            setSortByName(false);
          }
        }
        if (header === "position") {
          if (sortbyPosition === false) {
            setSortByName(false);
            setSortByDeparment(false);
            setSortByStatus(false);
            setSortByPosition(true);
          } else {
            setSortByPosition(false);
          }
        }
        if (header === "department") {
          if (sortByDepartment === false) {
            setSortByName(false);
            setSortByPosition(false);
            setSortByStatus(false);
            setSortByDeparment(true);
          } else {
            setSortByDeparment(false);
            // resetCheckboxes();
          }
        }
        if (header === "state") {
          if (sortByStatus === false) {
            setSortByName(false);
            setSortByPosition(false);
            setSortByDeparment(false);
            setSortByStatus(true);
          } else {
            setSortByStatus(false);
            // resetCheckboxes();
          }
        }
      }
    }
  
    //Prevent user from using the Enter key when using the search/filter bar
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }
  
    // Function to handle "Select All" button click
    // const handleSelectAll = () => {
    //   // console.log(data)
    //   checkboxRef.current!.checked ? setCheckBoxes(true) : setCheckBoxes(false)
    // };
  
    // useEffect(() => {
    //   const userCheckboxes = document.getElementsByName('usersCheckbox') as NodeListOf<HTMLInputElement>;
  
    //   for (let i = 0; i < userCheckboxes.length; i++) {
    //     const checkbox = userCheckboxes[i];
    //     if (checkbox) {
    //       checkbox.checked = checkBoxes;
    //     }
    //   }
  
    //   if (checkBoxes === false) {
    //     checkboxArray.splice(0);
    //   } else {
    //     for (let i = 0; i < userCheckboxes.length; i++) {
    //       const checkbox = userCheckboxes[i];
    //       if (checkbox) {
    //         checkboxArray.push(checkbox.value);
  
    //       };
    //     };
    //   };
    // }, [checkBoxes])
  
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
  
    // Assuming data is your dataset
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : (sortByName === true || sortbyPosition === true || sortByDepartment === true ? dataTemp : data))).slice(indexOfFirstItem, indexOfLastItem);
    const dataLength = (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : (sortByName === true || sortbyPosition === true || sortByDepartment === true ? dataTemp : data))).length
  
    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const updateCheckboxArray = (producto: string) => {
        const checkbox = document.getElementById(producto + "Checkbox") as HTMLInputElement;
        if (checkbox.checked){
            checkboxArray.push(producto)
        }else {
            const indexToRemove = checkboxArray.indexOf(producto);
            checkboxArray.splice(indexToRemove, 1);
        }
    }
  
    // const updateCheckboxArray = (badge: string) => {
    //   const checkbox = document.getElementById('checkbox-' + badge) as HTMLInputElement;
    //   if (checkbox.checked) {
    //     checkboxArray.push(badge);
    //   } else {
    //     const indexToRemove = checkboxArray.indexOf(badge);
    //     checkboxArray.splice(indexToRemove, 1);
    //   };
    // };
  
    // const resetCheckboxes = () => {
    //   setCheckBoxes(false);
    //   checkboxArray.splice(0);
    //   checkboxRef.current!.checked = false;
    //   const userCheckboxes = document.getElementsByName('usersCheckbox') as NodeListOf<HTMLInputElement>;
  
    //   for (let i = 0; i < userCheckboxes.length; i++) {
    //     const checkbox = userCheckboxes[i];
    //     if (checkbox) {
    //       checkbox.checked = false;
    //     };
    //   };
    // };
  
    const formatDate = (dateString: string): string => {
      const dateObject: Date = new Date(dateString);
  
      return dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    };
  
    const [show, setShow] = useState(false)
    const handleChange = (selectedDate: Date) => {
      let dateString = selectedDate.toString();
      dateString = formatDate(dateString)
      dateString = dateString.replace(/\//g, '-');
      setFromDate(dateString)
    }
  
    const handleClose = (state: boolean) => {
      setShow(state)
    }
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
  
    useEffect(() => {
      setSharedState(!sharedState);
    }, [fromDate, toDate]);
  
    //   useEffect(() => {
    //     if (fromDate) {
    //       const [month, day, year] = fromDate.split('-').map(Number);
    //       const fromDateObj = new Date(year, month - 1, day);
  
    //       const filteredData = data.filter(item => {
    //         const itemDate = new Date(item.creationDate);
    //         return itemDate >= fromDateObj;
    //     });
    //     setData(filteredData);
    //   } else {
    //     setData(originalData);
    //   }
    // }, [originalData, fromDate]);
  
  
    useEffect(() => {
      if (toDate) {
        console.log(toDate);
      }
    }, [toDate]);
  
    const [show2, setShow2] = useState(false)
    const handleChange2 = (selectedDate: Date) => {
      let dateString = selectedDate.toString();
      dateString = formatDate(dateString)
      dateString = dateString.replace(/\//g, '-');
      setToDate(dateString)
    }
    const handleClose2 = (state: boolean) => {
      setShow2(state)
    }
  
  
  
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
      Available: false,
      Delivered: false,
      Assigned: false,
    });
  
  
    // // Manejo del cambio de checkbox
    // const handleCheckboxChange = (key: string, checked: boolean) => {
    //   setCheckedItems((prev) => ({
    //     ...prev,
    //     [key]: checked,
    //   }));
  
    //   if (checked) {
    //     navigate(`/cards?account=${key}`); // Redirigir al hacer clic si está chequeado
    //   }
    //   if (!checked) {
    //     window.location.reload()
    //   }
    // };
  
  
  
  
    useEffect(() => {
      console.log('checkedItems ha cambiado:', checkedItems);
      // Aquí puedes agregar otras acciones relacionadas con `checkedItems`
  
  
    }, [setCheckedItems]); // Depende de `checkedItems`
  
    const handleCheckboxChange = (key: string, checked: boolean) => {
      // Si el checkbox se marca, limpiar todos los demás y marcar solo el seleccionado
  
  
      const newCheckedItems = Object.keys(checkedItems).reduce((acc, k) => {
        // Solo marcar el checkbox seleccionado, desmarcar el resto
        acc[k] = k === key && checked;
        return acc;
      }, {} as Record<string, boolean>); // Objeto actualizado con solo el checkbox seleccionado
  
      setCheckedItems(newCheckedItems); // Actualiza el estado
  
  
      if (checked) {
        navigate(`/cards?account=${key}`); // Redirige si el checkbox se marca
      } else {
        window.location.reload();  // Recarga si se desmarca
      }
    };
  
  
  
  
    interface CheckboxProps {
      label: string;
      checked: boolean;
      onChange: (checked: boolean) => void;
      onClick: (checked: boolean) => void;
  
    }
  
    const navigate = useNavigate(); // Hook para redirigir en React Router
  
    const handleCheckboxClick = () => {
  
      navigate('/cards'); // Redirige a la URL '/cards'
  
    };
  
  
    const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
      return (
        <div className="flex items-center text-white">
          <FlowbiteCheckbox
            checked={checked}  // Estado del checkbox
            onChange={(e) => onChange(e.target.checked)}  // Manejo de cambio
            onClick={handleCheckboxClick} // Maneja el evento de clic para redirigir
          />
          <label className="ml-2 dark:text-white text-gray-700  ">{label}</label>
        </div>
      );
    };
  
    return (
      <NavbarSidebarLayout2 isFooter={true}>
        <div className="block items-center justify-between border-b rounded-tl-2xl rounded-tr-2xl border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 style={{ zoom: 0.90 }} className="text-xl ml-4 mt-4 font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Equipment Inventory
              </h1>
            </div>
            <div className="sm:flex" style={{ zoom: 0.90 }}>
              <div className="mb-3 ml-4 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <form className="lg:pr-3">
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      placeholder="Search for equipment"
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </form>
                <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                  <a
                    href="/cards"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Refresh</span>
                    <HiRefresh className="text-2xl mr-2" />
                  </a>
                <Dropdown label="Filter Equipment" dismissOnClick={false}>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"monitoresCheckbox"} value={"Monitores"} name={"monitoresCheckbox"} onChange={() => updateCheckboxArray("monitores")} />Monitores</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"tecladosCheckbox"} value={"Teclados"} name={"tecladosCheckbox"} onChange={() => updateCheckboxArray("teclados")} />Teclados</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"headsetsCheckbox"} value={"Headsets"} name={"tecladosCheckbox"} onChange={() => updateCheckboxArray("headsets")} />Headsets</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"mouseCheckbox"} value={"Mouse"} name={"mouseCheckbox"} onChange={() => updateCheckboxArray("mouse")} />Mouse</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"laptopsCheckbox"} value={"Laptop"} name={"laptopsCheckbox"} onChange={() => updateCheckboxArray("laptops")} />Laptops</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"cpuCheckbox"} value={"CPU"} name={"cpuCheckbox"} onChange={() => updateCheckboxArray("cpu")} />CPUs</Dropdown.Item>
                    <Dropdown.Item><FlowbiteCheckbox className="mr-2" id={"tabletCheckbox"} value={"Tablet"} name={"tabletCheckbox"} onChange={() => updateCheckboxArray("tablet")} />Tablets</Dropdown.Item>
                </Dropdown>
                </div>
              </div>
              {userLevel == '1' ?
                <div className="ml-auto mr-4 flex items-center space-x-2 sm:space-x-3">
                  <AddTaskModal
                    sharedState={sharedState}
                    updateSharedState={updateSharedState} />
                  <ExportModal
                    data={data} />
                </div>
                : <></>}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" style={{ zoom: 0.85 }}>
                  <Table.Head className="bg-gray-100 dark:bg-gray-700">
                    {/* <Table.HeadCell>
                      <Label htmlFor="select-all" className="sr-only">
                        Select all
                      </Label>
                      <Checkbox id="select-all" name="select-all" ref={checkboxRef} onChange={handleSelectAll} />
                    </Table.HeadCell> */}
                    <Table.HeadCell className="">ID</Table.HeadCell>
                    {/* <Table.HeadCell className="">Ticket ID</Table.HeadCell> */}
                    {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "department")}>Period</Table.HeadCell> */}
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Quantity</Table.HeadCell>
                    {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Description</Table.HeadCell> */}
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Category</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Model</Table.HeadCell>
                    {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Date Updated</Table.HeadCell> */}
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "state")}>Brand</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Details</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Total</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Account</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Vendor</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Status</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Request Owner</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Request Name</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Created By</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Delivered Date</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Date/Time</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Received By</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Delivered By</Table.HeadCell>
                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Updated Date</Table.HeadCell>
                    {/* {created_user === "3199" || created_user === "3814" ? */}
                    <Table.HeadCell>Actions</Table.HeadCell>
                    {/* : <></>} */}
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {
                      currentItems.map((item, index) => (
                        <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          {/* <Table.Cell className="w-4">
                              <div className="flex items-center">
                                <Checkbox id={"checkbox-" + user.id} value={user.id} name="usersCheckbox" onChange={() => updateCheckboxArray(user.id)} />
                                <label htmlFor={"checkbox-" + user.id} className="sr-only">
                                </label>
                              </div>
                            </Table.Cell> */}
                          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              <div id={"itemID" + item.id} className="text-base font-semibold text-gray-900 dark:text-white">
                                {item.id}
                              </div>
                              <div className="text-sm whitespace-pre-wrap font-normal text-gray-500 dark:text-gray-400">
                                {/* {user.account} */}
                                #{item.idTicket}
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className=" text-primary-800 font-bold px-2 py-0.5 rounded dark:text-white">
                              {item.quantity}
                            </span>
                          </Table.Cell>
                          {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                              <span>
                                {user.period}
                              </span>
                            </Table.Cell> */}
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className="bg-green-600 text-green-200 font-semibold px-2 py-0.5 rounded dark:bg-green-700 dark:text-green-200">
                              {item.category}
                            </span>
                          </Table.Cell>
                          {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full inline-block mr-2 ${user.status === "Available" ? "bg-green-400" :
                                user.status === "Delivered" ? "bg-blue-400" :
                                  user.status === "Assigned" ? "bg-yellow-400" : ""
                                }`}></div>
                              {user.status}
                            </div>
                          </Table.Cell> */}
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className="bg-yellow-600 text-yellow-200 font-semibold px-2 py-0.5 rounded dark:bg-yellow-400 dark:text-yellow-900">
                              {item.model}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.brand}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className="bg-indigo-600 text-indigo-200 font-semibold px-2 py-0.5 rounded dark:bg-indigo-400 dark:text-indigo-900">
                              {item.details}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-bold text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                              </svg>
                              {item.total}
                            </div>
  
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.account}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.vendor}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.requestOwner}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.requestName}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.createdBy}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.deliveredDate}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.dateTime}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.receivedBy}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.deliveredBy}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {item.updatedDate}
                            </span>
                          </Table.Cell>
                          {userLevel == '1' ? (
                            <Table.Cell>
                              <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditUserModal
                                  id={item.id}
                                  status2={item.status}
                                  agentBadge2={item.agentBadge}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                                <DeleteUserModal
                                  id={item.id}
                                  active={item.active}
                                  created_user={created_user}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </div>
                            </Table.Cell>
                          ) : (
                            <Table.Cell>
                              <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditUserModal
                                  id={item.id}
                                  status2={item.status}
                                  agentBadge2={item.agentBadge}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </div>
                            </Table.Cell>
                          )}
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <Pagination itemsPerPage={itemsPerPage} totalItems={dataLength} paginate={paginate} />
      </NavbarSidebarLayout2>
    );
  };
  
  const Pagination = ({ itemsPerPage, totalItems, paginate }: any) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    const indexOfLastPage = currentPage + 2;
    const indexOfFirstPage = indexOfLastPage - 4;
    const currentPages = pageNumbers.slice(Math.max(indexOfFirstPage, 0), Math.min(indexOfLastPage, totalPages));
  
    const paginateHandler = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      paginate(pageNumber);
    };
  
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
        paginate(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        paginate(currentPage - 1);
      }
    };
  
    return (
      <nav aria-label="Page navigation example">
        <ul className="flex items-center justify-center -space-x-px mt-3 h-8 text-sm">
          <li>
            <a onClick={prevPage} href="#!" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {/* <a onClick={prevPage} href="#!" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"> */}
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
              </svg>
            </a>
          </li>
          {currentPages.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'z-10 bg-blue-50 border-blue-300 text-blue-600 dark:bg-gray-700' : 'dark:bg-gray-800 text-gray-500 bg-white border-gray-300'}`}>
              <a onClick={() => paginateHandler(number)} href="#!" className="flex items-center justify-center px-3 h-8 leading-tight hover:bg-gray-100 hover:text-gray-700  dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                {number}
              </a>
            </li>
          ))}
          <li>
            <a onClick={nextPage} href="#!" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    );
  };
  
  const AddTaskModal: FC<any> = function ({ sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
    const [supBadge, setSupBadge] = useState<any>('');
    const [result, setResult] = useState<any>([]);
    const [supervisorName, setSupervisorName] = useState('');
    const [amount, setAmount] = useState('');
    const [account, setAccount] = useState('');
    const [vendor, setVendor] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const urlHired = `https://bn.glassmountainbpo.com:8080/api/hired/`;
  
    const handleAmountChange = (e: any) => {
      const { value } = e.target;
      const numericValue = value.replace(/[^0-9]/g, '');
      setAmount(numericValue);
    };
  
    const handleBlur = () => {
      // Format the value on blur (when the user clicks away from the input)
      setAmount((currentValue) => {
        if (!currentValue) return '';
        const numericValue = parseFloat(currentValue).toFixed(2);
        return `${numericValue}`;
      });
    };
  
    const handleFocus = (e: any) => {
      // Remove formatting when the input is focused (to make editing easier)
      const { value } = e.target;
      const numericValue = value.replace(/[^0-9.]/g, '');
      setAmount(numericValue);
    };
  
    const handleTrack = () => {
      if (supBadge.length !== 0) {
        axios.get(urlHired + supBadge)
          .then((response => {
            setResult(response.data);
            const data = response.data;
            if (data.first_name !== undefined) {
              setSupervisorName(data.first_name + " " + data.second_name + " " + data.first_last_name + " " + data.second_last_name);
            } else {
              setSupervisorName('');
            }
          }));
      }
    };
  
    const handleKeyPress = (e: { key: string; }) => {
      if (e.key === "Enter") {
        handleTrack();
      }
    };
  
    interface DataType {
      name: string;
      id: number;
      idCategory: number;
    }
  
    interface VendorType {
      name: string;
      id: number;
      active: number;
      creationDate: string;
      logs: string;
    }
  
    const [data, setData] = useState<DataType[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://bn.glassmountainbpo.com:8080/giftCards/accounts');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      };
      fetchData();
    }, []);
  
    const [vendorList, setVendorList] = useState<VendorType[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://bn.glassmountainbpo.com:8080/giftCards/vendors');
          setVendorList(response.data);
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      };
      fetchData();
    }, []);
  
    const resetFields = () => {
      setAccount('');
      setSupBadge('');
      setAmount('');
      setExpirationDate('');
      setVendor('');
      setQuantity('');
      setSupervisorName('');
    };
  
    const url2 = `https://bn.glassmountainbpo.com:8080/giftCards/addCard`;
    const handleSubmit = async (e: React.FormEvent) => {
      if (!supervisorName) {
        alert('Enter a valid Supervisor Badge!')
      } else if (!amount) {
        alert('Enter a valid Gift Card balance amount!')
      } else if (!expirationDate) {
        alert('Enter a valid expiration date!')
      } else if (!vendor) {
        alert('Enter a valid vendor!')
      } else if (!account) {
        alert('Enter a valid account!')
      } else if (!quantity) {
        alert('Enter a valid Gift Card quantity!')
      } else {
        e.preventDefault()
        try {
          const response = await axios.post(url2, {
            account,
            supBadge,
            amount,
            expirationDate,
            vendor,
            quantity,
            supervisorName
          })
          if (response.status == 200) {
            const responseData = response.data;
            updateSharedState(!sharedState);
  
            if (responseData.message === "Card(s) created") {
              setOpen(false);
              resetFields();
              alert('Gift card(s) entered successfully!')
            } else {
              console.log("Fatal Error");
            }
          }
        } catch (error) {
          console.log(error);
          setOpen(false)
        }
      }
    }
  
    const [show, setShow] = useState(false);
  
    const handleDateChange = (selectedDate: Date) => {
      const formattedDate = formatDate(selectedDate);
      setExpirationDate(formattedDate);
    };
  
    const handleDateClose = (state: boolean) => {
      setShow(state)
    };
  
    function formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed.
      const day = date.getDate().toString().padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    }
  
    return (
      <>
        <Button color="primary" onClick={() => { setOpen(true) }}>
          <div className="flex items-center gap-x-3">
            <HiPlus className="text-xl" />
            Add Equipment
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add new Gift Cards!</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="account">Account</Label>
                <div className="mt-1">
                  <Select
                    id="account"
                    name="account"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  >
                    {data.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
  
                    <option value="QA">QA </option>
                    <option value="R1 MICHIGAN">R1 MICHIGAN </option>
                    <option value="R1 OKLAHOMA">R1 OKLAHOMA </option>
                    <option value="GMC">GMC </option>
                    <option value="TRAINING">TRAINING </option>
                  </Select>
  
                </div>
              </div>
              <div>
                <Label htmlFor="period">Supervisor's Badge</Label>
                <div className="mt-1">
                  <TextInput
                    id="supBadge"
                    name="supBadge"
                    placeholder="3814"
                    value={supBadge}
                    onChange={(e) => setSupBadge(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="amount">Balance Amount</Label>
                <div className="mt-1">
                  <TextInput
                    id="amount"
                    placeholder="$25.00"
                    name="amount"
                    value={amount ? '$' + amount : ''}
                    onChange={handleAmountChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vendor">Vendor</Label>
                <div className="mt-1">
                  <Select
                    id="vendor"
                    name="vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                  >
                    {vendorList.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="mt-1">
                  <TextInput
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="10"
                    value={quantity}
                    onChange={e => {
                      setQuantity(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label className="" htmlFor="supName">Supervisor's Name</Label>
                <div className="mt-1">
                  <TextInput
                    id="supName"
                    name="supName"
                    placeholder="This field is automatically generated"
                    value={result.first_name !== undefined ? result.first_name + " " + result.second_name + " " + result.first_last_name + " " + result.second_last_name : ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              onClick={(e) => { handleSubmit(e) }}>
              Add card(s)
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const EditUserModal: FC<any> = function ({ id, status2, agentBadge2, sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
    const [status, setStatus] = useState(status2);
    const [agentBadge, setAgentBadge] = useState(agentBadge2);
  
    useEffect(() => {
      setStatus(status2);
    }, [status2]);
  
    useEffect(() => {
      setAgentBadge(agentBadge2);
    }, [agentBadge2]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response = await axios.post('https://bn.glassmountainbpo.com:8080/giftCards/cardStatusChange', {
          id,
          agentBadge,
          status,
          created_user
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);
          setOpen(false);
          if (responseData.message === "Card updated") {
            setOpen(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <>
        <Button className="text-white bg-green-400 dark:bg-green-400 dark:enabled:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiOutlinePencilAlt className="text-lg" />
  
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit Task</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <Label htmlFor="id">Card ID</Label>
                <div className="mt-1">
                  <TextInput
                    id="id"
                    name="id"
                    value={id}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taskName">Agent's Badge</Label>
                <div className="mt-1">
                  <TextInput
                    value={agentBadge}
                    onChange={e => { setAgentBadge(e.target.value) }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <div className="mt-1">
                  <Select
                    id="status"
                    name="status"
                    value={status}
                    onChange={e => { setStatus(e.target.value) }}
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    {userLevel == '2' ? null : <option value="Delivered">Delivered</option>}
                  </Select>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              onClick={(e) => { handleSubmit(e); }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  
  const DeleteUserModal: FC<any> = function ({ id, active, sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent, id: any, state: any, created_user: any) => {
      e.preventDefault()
      try {
        const response = await axios.post('https://bn.glassmountainbpo.com:8080/dev/taskStateChange', {
          id,
          state,
          created_user
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);
          setOpen(false);
  
          if (responseData.message === "Task updated") {
            setOpen(false);
          } else {
            console.log("Fatal Error");
          }
        }
      } catch (error) {
        console.log(error);
        setOpen(false)
      }
    };
  
    return (
      created_user === "3199" || created_user === "3814" ?
        <>
          <Button color={(active == '1') ? "dark" : "dark"} onClick={() => setOpen(true)}>
            <div className="flex items-center gap-x-2">
              {(active == '1') ? <FaTimes color="white" className="text-lg" /> : <FaCheck color="white" className="text-lg" />}
            </div>
          </Button>
          <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
            <Modal.Header className="px-6 pt-6 pb-0">
              <span className="sr-only">Delete user</span>
            </Modal.Header>
            <Modal.Body className="px-6 pt-0 pb-6">
              <div className="flex flex-col items-center gap-y-6 text-center">
                {(active == '1') ? <FaTimes className="text-7xl text-red-500" /> : <FaCheck className="text-7xl text-green-500" />}
                <p className="text-xl text-gray-500">
                  {(active == '1') ? "Are you sure you want to deactivate this user?" : "Are you sure you want to activate this user?"}
                </p>
                <div className="flex items-center gap-x-3">
                  <Button color={(active == '1') ? "failure" : "success"} onClick={(e) => { handleSubmit(e, id, active, created_user) }}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setOpen(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
        :
        <></>
    );
  };
  
  
  
  const ExportModal: FC<any> = function (rawData) {
    const [isOpen, setOpen] = useState(false);
    const data = rawData.data;
  
  
    const convertToCSV = (data: any) => {
      const csvRows = [];
      const headers = Object.keys(data[0]);
  
      // Modificar las cabeceras según sea necesario
      const modifiedHeaders = headers.map(header => {
        if (header === 'creation_date' || header === 'experation_date') {
          return header.replace('_', ' ').toUpperCase(); // Convertir a mayúsculas y reemplazar '_' con ' '
        } else if (header === 'id_groups') {
          return 'ID GROUPS'; // Cambiar el nombre de la cabecera
        } else {
          return header.toUpperCase(); // Convertir a mayúsculas
        }
      });
  
      csvRows.push(modifiedHeaders.join(','));
  
      for (const row of data) {
        const values = headers.map(header => {
          if (header === 'creationDate' || header === 'deliveredDate' || header == 'expirationDate') {
            // Formatear las fechas como dd/mm/yyyy
            const date = new Date(row[header]);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          } else if (header === 'id_groups') {
            // Formatear los ID Groups como "400 - 401 - 402 - 403 - 404"
            return row[header].split(',').join(' - ');
          } else {
            return row[header];
          }
        });
        csvRows.push(values.join(','));
      }
  
      return csvRows.join('\n');
    };
  
  
  
  
    // Function to export data to CSV and prompt download
    const exportToCSV = () => {
      console.log(data);
  
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CardsReports.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      setOpen(false);
    };
  
    // Function to convert an array to an XLS file
    const exportToXLS = () => {
      console.log(data);
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'CardsReports.xlsx');
      setOpen(false);
    };
  
    return (
      <>
        <Button onClick={() => setOpen(true)} color="gray">
          <div className="flex items-center gap-x-3">
            <HiDocumentDownload className="text-xl" />
            <span>Export</span>
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Export users</strong>
          </Modal.Header>
          <Modal.Body className="flex flex-col items-center gap-y-6 text-center">
            <div className="flex items-center gap-x-3">
              <div>
                <Button onClick={exportToCSV} color="light">
                  <div className="flex items-center gap-x-3">
                    <FiletypeCsv className="text-xl" />
                    <span>Export CSV</span>
                  </div>
                </Button>
              </div>
              <div>
                <Button onClick={exportToXLS} color="light">
                  <div className="flex items-center gap-x-3">
                    <FiletypeXlsx className="text-xl" />
                    <span>Export XLSX</span>
                  </div>
                </Button>
              </div>
            </div>
          </Modal.Body>
  
        </Modal>
      </>
    )
  
  }
  
  
  export default Cards;