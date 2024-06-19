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

import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import axios from "axios";
import { FiletypeCsv, FiletypeXlsx } from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';

import UAParser from 'ua-parser-js';


import CryptoJS from "crypto-js";

import * as XLSX from 'xlsx';
import { FaTags, } from 'react-icons/fa'; // Ejemplo con FontAwesome



const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");


const ArrayBagde = ['3199', '3814', '3897', '2181'];
const condicion = ArrayBagde.includes(created_user) ? '1' : '0';
console.log('========Esta es la condicion:', condicion);

const userLevel3 = localStorage.getItem("userLevel") || "";
const userLevel2 = (userLevel3 ? CryptoJS.AES.decrypt(userLevel3, "Tyrannosaurus") : "");
const userLevel = (userLevel2 ? userLevel2.toString(CryptoJS.enc.Utf8) : "");

const Category: FC = function () {
  const [searchParams] = useSearchParams();
  const account = searchParams.get('account');
  const [data, setData] = useState([] as any[]);
  let [filteredResults, setFilteredResults] = useState([] as any[]);
  let [dataTemp, setDataTemp] = useState([] as any[]);

  const [sharedState, setSharedState] = useState(false);

  const updateSharedState = (newValue: boolean) => {

    setSharedState(newValue);
  }

  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/inventory/listCategory')
      .then(res => {
        if (userLevel === '2') {
          // Filter data where supervisorBadge equals created_user
          const filteredData = res.data.filter((item: { supervisorBadge: string; }) => item.supervisorBadge === created_user);
          setData(filteredData);
        } else {
          // If userLevel is not 2, set data as is
          setData(res.data);
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

      setFilteredResults(filteredRawData);
      // resetCheckboxes();
    } else {
      let foo = data;

      setDataTemp(foo);
    }
  }, [searchInput, dataTemp, data]);


  //Prevent user from using the Enter key when using the search/filter bar
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Assuming data is your dataset
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : data)).slice(indexOfFirstItem, indexOfLastItem);
  const dataLength = (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : data)).length

  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);


  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    Available: false,
    Delivered: false,
    Assigned: false,
  });

  useEffect(() => {
    console.log('checkedItems ha cambiado:', checkedItems);

  }, [setCheckedItems]); // Depende de `checkedItems`


  return (
    <NavbarSidebarLayout2 isFooter={true}>
      <div className="block items-center justify-between border-b rounded-tl-2xl rounded-tr-2xl border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 style={{ zoom: 0.90 }} className="text-xl ml-4 mt-4 font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Assets
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
                    placeholder="Search for gift card"
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Refresh</span>
                  <HiRefresh className="text-2xl" />
                </a>

              </div>
            </div>

            <div className="ml-auto mr-4 flex items-center space-x-2 sm:space-x-3">
              <AddTaskModal
                sharedState={sharedState}
                updateSharedState={updateSharedState} />
              <ExportModal
                data={data} />
            </div>

          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" style={{ zoom: 0.85 }}>
                <Table.Head className="bg-gray-100 dark:bg-gray-700">

                  <Table.HeadCell className="">ID</Table.HeadCell>
                  <Table.HeadCell className="">Name</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Status</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Date Created</Table.HeadCell>
                  {condicion == '1' ? <>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </> : <Table.HeadCell></Table.HeadCell>}

                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {
                    currentItems.map((user, index) => (
                      <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">

                        <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div id={"taskName" + user.id + user.name} className="text-base font-semibold text-gray-900 dark:text-white">
                              {user.id}
                            </div>

                          </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaTags className="mr-2" />
                            <span className="text-dark-800 font-bold px-2 py-0.5 rounded dark:text-white">
                              {user.name}
                            </span>
                          </div>

                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className=" text-black-800 font-bold px-2 py-0.5 rounded dark:text-white">
                            {user.active == 1 ? 'Active' : 'Inactive'}

                            <div className={`ml-4 h-2 w-2 rounded-full inline-block mr-2 ${user.active === 1 ? "bg-green-400" :
                              user.active === 1 ? "bg-blue-400" :
                                user.active === 0 ? "bg-red-500" : ""
                              }`}></div>
                          </span>
                        </Table.Cell>

                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className="bg-gray-600 text-gray-100 font-semibold px-2 py-0.5 rounded dark:bg-pink-500 bg-gradient-to-r from-blue-700 to-green-500 dark:from-green-500 dark:to-blue-700 dark:text-gray-200">

                            {goodDisplay(user.date_created)}
                          </span>
                        </Table.Cell>
                        {userLevel == '1' ? (
                          <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                              {condicion == '1' ? <>
                                <EditUserModal
                                  id={user.id}
                                  active={user.active}
                                  name={user.name}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </> : <></>}
                            </div>
                          </Table.Cell>
                        ) : (
                          // <Table.Cell>
                          //   <div className="flex items-center gap-x-3 whitespace-nowrap">
                          //     <EditUserModal
                          //       id={user.id}
                          //       active={user.active}
                          //       name={user.name}
                          //       sharedState={sharedState}
                          //       updateSharedState={updateSharedState}
                          //     />
                          //   </div>
                          // </Table.Cell>
                          ''
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

  const [name, setName] = useState('');
  const [statusActive, setStatusActive] = useState('');


  const urlHired = `https://bn.glassmountainbpo.com:8080/api/hired/`;

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


  const resetFields = () => {
    setName('');
    setSupBadge('');
    setStatusActive('');
    setSupervisorName('');
  };

  console.log(result, supervisorName)




  const url2 = `https://bn.glassmountainbpo.com:8080/inventory/addCategory`;
  const handleSubmit = async (e: React.FormEvent) => {
    if (!name) {
      alert('Enter a valid category name')
    } else if (!statusActive) {
      alert('Enter a valid status!')
    } else {
      e.preventDefault()
      try {
        const response = await axios.post(url2, {
          name,
          statusActive,
          created_user,
          info
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);

          if (responseData.message === "Category created") {
            setOpen(false);
            resetFields();
            alert('Category created successfully!')
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


  // auditoria 

  interface BrowserInfo {
    browser: string;
    device: string;
    os: string;
    location: string; // Lugar que será obtenido después
  }


  const [info, setInfo] = useState<BrowserInfo>({
    browser: '',
    device: '',
    os: '',
    location: 'Unknown',
  });

  useEffect(() => {
    // Obtiene información del navegador
    const parser = new UAParser();
    const browserName = parser.getBrowser().name || 'Unknown';
    const deviceType = parser.getDevice().type || 'Unknown';
    const osName = parser.getOS().name || 'Unknown';

    // Actualiza información del navegador y dispositivo
    setInfo({
      ...info,
      browser: browserName,
      device: deviceType,
      os: osName,
    });

    // Obtiene la ubicación geográfica (si el usuario lo permite)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setInfo((prevInfo) => ({
            ...prevInfo,
            location: `Lat: ${lat}, Lon: ${lon}`,
          }));
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  console.log('XXXXXXXXXXXXXXXXXXXXXX info: ', info);


  return (
    <>
      <Button color="primary" onClick={() => { setOpen(true) }}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Asset
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Asset!</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="mt-1">
                <TextInput
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                >

                </TextInput>

              </div>
            </div>
            <div>

              <Label htmlFor="vendor">Status</Label>
              <div className="mt-1">
                <Select
                  id="vendor"
                  name="vendor"
                  value={statusActive}
                  onChange={(e) => setStatusActive(e.target.value)}
                >
                  <option value={""}>Selected</option>
                  <option value={"1"}>Active</option>
                  <option value={"0"}>Inactive</option>
                </Select>
              </div>

            </div>
            <div>
              <div>
                <Label htmlFor="period">Admin User</Label>
                <div className="mt-1">
                  <TextInput
                    id="supBadge"
                    name="supBadge"
                    placeholder="3814"
                    value={created_user}
                    onChange={(e) => setSupBadge(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    required
                    readOnly

                  />
                </div>
              </div>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={(e) => { handleSubmit(e) }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditUserModal: FC<any> = function ({ id, active, name, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState(active);
  const [nameCategory, setNameCategory] = useState(name);

  useEffect(() => {
    setStatus(active);
  }, [active]);

  useEffect(() => {
    setNameCategory(name);
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/editCategory', {
        id,
        nameCategory,
        status,
        created_user
      })
      if (response.status == 200) {
        const responseData = response.data;
        updateSharedState(!sharedState);
        setOpen(false);
        if (responseData.message === "OK") {
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
          <strong>Edit Asset</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="id">ID Asset</Label>
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
              <Label htmlFor="taskName">Name Asset</Label>

              <div className="mt-1">
                <TextInput
                  value={name}
                  onChange={e => { setNameCategory(e.target.value) }}

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
                  <option value="">Selected</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                  {/* {userLevel == '2' ? null : <option value="Delivered">Delivered</option>} */}
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


const ExportModal: FC<any> = function (rawData) {
  const [isOpen, setOpen] = useState(false);
  const data = rawData.data;


  const convertToCSV = (data: any) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);

    // Modificar las cabeceras según sea necesario
    const modifiedHeaders = headers.map(header => {
      if (header === 'date_created') {
        return header.replace('_', ' ').toUpperCase(); // Convertir a mayúsculas y reemplazar '_' con ' '
      } else {
        return header.toUpperCase(); // Convertir a mayúsculas
      }
    });

    csvRows.push(modifiedHeaders.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        if (header === 'date_created') {
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
    a.download = 'CategoryReports.csv';
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


export default Category;