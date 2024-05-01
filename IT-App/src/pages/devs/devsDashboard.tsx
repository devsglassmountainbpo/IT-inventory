/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
  Progress,
  Badge

} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, SetStateAction, useRef } from "react"
import {
  // HiChevronLeft,
  // HiChevronRight,
  HiRefresh,
  HiDocumentDownload,
  // HiOutlinePencilAlt,
  HiPlus,
  HiOutlinePencilAlt,
  HiEye,
} from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa"
import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import axios from "axios";
import { FiletypeCsv, FiletypeXlsx } from 'react-bootstrap-icons';
import ApexCharts from 'apexcharts'; // Importación del módulo ApexCharts



import { BiSave } from "react-icons/bi";

import CryptoJS from "crypto-js";

import * as XLSX from 'xlsx';
import CountUp from "react-countup";

const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");

const DevsDashboard: FC = function () {

  const [data, setData] = useState([] as any[]);
  let [filteredResults, setFilteredResults] = useState([] as any[]);
  let [sortByName, setSortByName] = useState(false);
  let [sortbyPosition, setSortByPosition] = useState(false);
  let [sortByDepartment, setSortByDeparment] = useState(false);
  let [sortByStatus, setSortByStatus] = useState(false);
  let [dataTemp, setDataTemp] = useState([] as any[]);
  let checkboxRef = useRef<HTMLInputElement>(null);
  const [checkBoxes, setCheckBoxes] = useState(false);
  const checkboxArray: string[] = [];
  const [sharedState, setSharedState] = useState(false);

  const updateSharedState = (newValue: boolean) => {
    resetCheckboxes();
    setSharedState(newValue);
  }

  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/dev')
      .then(res => setData(res.data))
  }, [sharedState])

  const [searchInput, setSearchInput] = useState('');
  const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (searchInput !== '') {
      const foo = data;
      let filteredRawData = foo.filter((user) => {
        return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
      })
      if (sortByName === true) {
        filteredRawData = filteredRawData.sort((a, b) => (a.taskName.toLowerCase() > b.taskName.toLowerCase()) ? 1 : -1);
      }
      if (sortbyPosition === true) {
        filteredRawData = filteredRawData.sort((a, b) => (a.status > b.status) ? 1 : -1);
      }
      if (sortByDepartment === true) {
        filteredRawData = filteredRawData.sort((a, b) => (a.department > b.department) ? 1 : -1);
      }
      if (sortByStatus === true) {
        filteredRawData = filteredRawData.sort((a, b) => (a.value > b.value) ? 1 : -1);
      }
      setFilteredResults(filteredRawData);
      resetCheckboxes();
    } else {
      let foo = data;
      if (sortByName === true) {
        foo = foo.sort((a, b) => (a.taskName.toLowerCase() > b.taskName.toLowerCase()) ? 1 : -1);
      }
      if (sortbyPosition === true) {
        foo = foo.sort((a, b) => (a.status > b.status) ? 1 : -1);
      }
      if (sortByDepartment === true) {
        foo = foo.sort((a, b) => (a.department > b.department) ? 1 : -1);
      }
      if (sortByStatus === true) {
        foo = foo.sort((a, b) => (a.value > b.value) ? 1 : -1);
      }
      setDataTemp(foo);
    }
  }, [searchInput, sortByName, sortbyPosition, sortByDepartment, sortByStatus, dataTemp, data]);

  const handleSortClick = (e: any, header: string) => {
    resetCheckboxes();
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
          resetCheckboxes();
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
          resetCheckboxes();
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
  const handleSelectAll = () => {
    // console.log(data)
    checkboxRef.current!.checked ? setCheckBoxes(true) : setCheckBoxes(false)
  };

  useEffect(() => {
    const userCheckboxes = document.getElementsByName('usersCheckbox') as NodeListOf<HTMLInputElement>;

    for (let i = 0; i < userCheckboxes.length; i++) {
      const checkbox = userCheckboxes[i];
      if (checkbox) {
        checkbox.checked = checkBoxes;
      }
    }

    if (checkBoxes === false) {
      checkboxArray.splice(0);
    } else {
      for (let i = 0; i < userCheckboxes.length; i++) {
        const checkbox = userCheckboxes[i];
        if (checkbox) {
          checkboxArray.push(checkbox.value);

        };
      };
    };
  }, [checkBoxes])

  const updateCheckboxArray = (badge: string) => {
    const checkbox = document.getElementById('checkbox-' + badge) as HTMLInputElement;
    if (checkbox.checked) {
      checkboxArray.push(badge);
    } else {
      const indexToRemove = checkboxArray.indexOf(badge);
      checkboxArray.splice(indexToRemove, 1);
    };
  };

  const resetCheckboxes = () => {
    setCheckBoxes(false);
    checkboxArray.splice(0);
    checkboxRef.current!.checked = false;
    const userCheckboxes = document.getElementsByName('usersCheckbox') as NodeListOf<HTMLInputElement>;

    for (let i = 0; i < userCheckboxes.length; i++) {
      const checkbox = userCheckboxes[i];
      if (checkbox) {
        checkbox.checked = false;
      };
    };
  };

  const formatDate = (dateString: string): string => {
    const dateObject: Date = new Date(dateString);

    return dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <NavbarSidebarLayout2 isFooter={true}>
      <CurrentTasksView
        sharedState={sharedState} />
      <AcquisitionOverview />
      <div className="block items-center justify-between border-b rounded-tl-2xl rounded-tr-2xl border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl ml-4 mt-4 font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Tasks
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 ml-4 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for task"
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href=""
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Refresh</span>
                  <HiRefresh className="text-2xl" />
                </a>
                {created_user === "3199" || created_user === "3814" ?
                  <DeleteUsersModal
                    users={checkboxArray}
                    created_user={created_user}
                    sharedState={sharedState}
                    updateSharedState={updateSharedState} /> : <></>}
                {created_user === "3199" || created_user === "3814" ?
                  <ActivateUsersModal
                    users={checkboxArray}
                    created_user={created_user}
                    sharedState={sharedState}
                    updateSharedState={updateSharedState} /> : <></>}
              </div>
            </div>
            {created_user === "3199" || created_user === "3814" ?
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
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" style={{ zoom: 0.90 }}>
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell>
                    <Label htmlFor="select-all" className="sr-only">
                      Select all
                    </Label>
                    <Checkbox id="select-all" name="select-all" ref={checkboxRef} onChange={handleSelectAll} />
                  </Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "name")} >Task</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "position")} >Status</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "department")}>Department</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Requester</Table.HeadCell>
                  {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Description</Table.HeadCell> */}
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Owner</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Date Created</Table.HeadCell>
                  {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Date Updated</Table.HeadCell> */}
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "state")}>Value</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">State</Table.HeadCell>
                  {/* {created_user === "3199" || created_user === "3814" ? */}
                  <Table.HeadCell>Actions</Table.HeadCell>
                  {/* : <></>} */}
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {
                    (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : (sortByName === true || sortbyPosition === true || sortByDepartment === true ? dataTemp : data))).map((user, index) => {
                      return (
                        <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Table.Cell className="w-4 p-4">
                            <div className="flex items-center">
                              <Checkbox id={"checkbox-" + user.taskID} value={user.taskID} name="usersCheckbox" onChange={() => updateCheckboxArray(user.taskID)} />
                              <label htmlFor={"checkbox-" + user.taskID} className="sr-only">
                              </label>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              <div id={"taskName" + user.badge} className="text-base font-semibold text-gray-900 dark:text-white">
                                {user.taskID + " - " + user.taskName}
                              </div>
                              <div className="text-sm whitespace-pre-wrap font-normal text-gray-500 dark:text-gray-400">
                                {user.description}
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {
                              user.status == "In Progress" ?
                                <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-yellow-500  md-2">
                                  {(user.status ? user.status : "N/A")}
                                </span>
                                : user.status == "Completed" ?
                                  <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-green-600  md-2">
                                    {(user.status ? user.status : "N/A")}
                                  </span>
                                  : user.status == "On Hold" ?
                                    <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-red-800  md-2">
                                      {(user.status ? user.status : "N/A")}
                                    </span>
                                    :
                                    <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-indigo-900  md-2">
                                      {(user.status ? user.status : "N/A")}
                                    </span>


                            }

                            {user.status == "Completed" ?
                              <>
                                <h1 className="text-sm font-normal text-gray-500 dark:text-gray-400"> 100%</h1>
                                <Progress color="indigo" progress={100} size="sm" />
                              </>
                              : <>
                                <h1 className="text-sm font-normal text-gray-500 dark:text-gray-400"> {user.percentage}%</h1>
                                <Progress color="indigo" progress={user.percentage} size="sm" />
                              </>
                            }


                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span>
                              {(user.department ? user.department : "N/A")}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {(user.requester ? user.requester : "N/A")}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-indigo-900  md-2">
                              {(user.owner ? user.owner : "N/A")}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {(user.dateCreated ? formatDate(user.dateCreated) : "N/A")}
                          </Table.Cell>
                          {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                              {(user.dateUpdated ? formatDate(user.dateUpdated) : "N/A")}
                            </Table.Cell> */}
                          {
                            user.value == "Critical" ?
                              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-black  md-2">
                                  {(user.value ? user.value : "N/A")}
                                </span>
                              </Table.Cell>
                              :
                              user.value == "High" ?
                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                  <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-red-700  md-2">
                                    {(user.value ? user.value : "N/A")}
                                  </span>
                                </Table.Cell>
                                :
                                user.value == "Mid" ?
                                  <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-yellow-500  md-2">
                                      {(user.value ? user.value : "N/A")}
                                    </span>
                                  </Table.Cell>
                                  :
                                  <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                    <span className="pr-2 pl-2 rounded-lg bg-indigo-100  text-sm-12 font-semibold  dark:text-white dark:bg-green-600  md-2">
                                      {(user.value ? user.value : "N/A")}
                                    </span>
                                  </Table.Cell>
                          }
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <div className={`mr-2 h-2.5 w-2.5 rounded-full ${(user.state == 1) ? 'bg-green-400' : 'bg-red-400'}`}></div>{" "}
                              {(user.state == '1') ? <span>Active</span> : <span>Inactive</span>}
                            </div>
                          </Table.Cell>
                          {created_user === "3199" || created_user === "3814" ? (
                            <Table.Cell>
                              <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditUserModal
                                  taskID={user.taskID}
                                  taskName2={user.taskName}
                                  status2={user.status}
                                  state2={user.state}
                                  department2={user.department}
                                  description2={user.description}
                                  value2={user.value}
                                  owner2={user.owner}
                                  requester2={user.requester}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                                <DetailsTask
                                  taskID={user.taskID}
                                  taskName2={user.taskName}
                                  status2={user.status}
                                  state2={user.state}
                                  department2={user.department}
                                  description2={user.description}
                                  value2={user.value}
                                  owner2={user.owner}
                                  requester2={user.requester}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                                <DeleteUserModal
                                  taskID={user.taskID}
                                  state={user.state}
                                  created_user={created_user}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </div>
                            </Table.Cell>
                          ) : (
                            <Table.Cell>
                              <div className="flex items-center gap-x-3 whitespace-nowrap">

                                <DetailsTask
                                  taskID={user.taskID}
                                  taskName2={user.taskName}
                                  status2={user.status}
                                  state2={user.state}
                                  department2={user.department}
                                  description2={user.description}
                                  value2={user.value}
                                  owner2={user.owner}
                                  requester2={user.requester}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </div>
                            </Table.Cell>
                          )}

                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {/* <Pagination /> */}
    </NavbarSidebarLayout2>
  );
};

const AddTaskModal: FC<any> = function ({ sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);

  const url = `https://bn.glassmountainbpo.com:8080/dev/addTask`;

  const [taskName, setTaskName] = useState('None');
  const [taskStatus, setTaskStatus] = useState('Not Started');
  const [taskDepartment, setTaskDepartment] = useState('IT');
  const [taskOwner, setTaskOwner] = useState('GMBPO Devs');
  const [taskValue, setTaskValue] = useState('Low');
  const [taskRequester, setTaskRequester] = useState('None');
  const [taskDescription, setTaskDescription] = useState('');

  const resetFields = () => {
    setTaskName('None');
    setTaskStatus('Not Started');
    setTaskDepartment('IT');
    setTaskOwner('GMBPO Devs');
    setTaskValue('Low');
    setTaskRequester('None');
    setTaskDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(url, {
        taskName,
        taskStatus,
        taskDepartment,
        taskOwner,
        taskValue,
        taskRequester,
        taskDescription,
        created_user
      })
      if (response.status == 200) {
        const responseData = response.data;
        updateSharedState(!sharedState);

        if (responseData.message === "Task created") {
          setOpen(false);
          resetFields();
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
    <>
      <Button color="primary" onClick={() => { setOpen(true) }}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Task
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new task</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="badge">Task Name</Label>
              <div className="mt-1">
                <TextInput
                  id="taskName"
                  name="taskName"
                  placeholder="IT Tool"
                  onChange={e => {
                    setTaskName(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="taskStatus">Status</Label>
              <div className="mt-1">
                <Select
                  id="taskStatus"
                  name="taskStatus"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="On Hold">Other</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="taskDepartment">Department</Label>
              <div className="mt-1">
                <Select
                  id="taskDepartment"
                  name="taskDepartment"
                  value={taskDepartment}
                  onChange={(e) => setTaskDepartment(e.target.value)}
                >
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Recruitment">Recruitment</option>
                  <option value="HR">HHRR</option>
                  <option value="Security">Security</option>
                  <option value="WFM">WFM</option>
                  <option value="Operations">Operations</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="taskOwner">Owner</Label>
              <div className="mt-1">
                <Select
                  id="taskOwner"
                  name="taskOwner"
                  value={taskOwner}
                  onChange={(e) => setTaskOwner(e.target.value)}
                >
                  <option value="GMBPO Devs">GMBPO Devs</option>
                  <option value="Jorge">Jorge</option>
                  <option value="Abisai">Abisai</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="taskValue">Value</Label>
              <div className="mt-1">
                <Select
                  id="taskValue"
                  name="taskValue"
                  value={taskValue}
                  onChange={(e) => setTaskValue(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Mid">Mid</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="taskRequester">Requester</Label>
              <div className="mt-1">
                <TextInput
                  id="taskRequester"
                  name="taskRequester"
                  placeholder="Riky Lemus"
                  autoComplete="off"
                  onChange={e => {
                    setTaskRequester(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div className="lg:col-span-2 mt-1">
              <Label className="" htmlFor="taskDescription">Description</Label>
              <div className="mt-2">
                <Textarea
                  id="taskDescription"
                  name="taskDescription"
                  autoComplete="off"
                  onChange={e => {
                    setTaskDescription(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={(e) => { handleSubmit(e) }}>
            Add task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditUserModal: FC<any> = function ({ taskID, taskName2, status2, state2, department2, description2, value2, owner2, requester2, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);
  const [taskName, setTaskName] = useState(taskName2)
  const [status, setStatus] = useState(status2)
  const [state, setState] = useState(state2)
  const [department, setDepartment] = useState(department2)
  const [description, setDescription] = useState(description2)
  const [value, setValue] = useState(value2)
  const [owner, setOwner] = useState(owner2)
  const [requester, setRequester] = useState(requester2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/dev/editTask', {
        taskID,
        taskName,
        status,
        state,
        department,
        description,
        value,
        owner,
        requester,
        created_user
      })
      if (response.status == 200) {
        const responseData = response.data;
        updateSharedState(!sharedState);
        setOpen(false);
        if (responseData.message === "Task updated successfully") {
          setOpen(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    created_user === "3199" || created_user === "3814" ?
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
                <Label htmlFor="taskID">Task ID</Label>
                <div className="mt-1">
                  <TextInput
                    id="taskID"
                    name="taskID"
                    value={taskID}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taskName">Task Name</Label>
                <div className="mt-1">
                  <TextInput
                    value={taskName}
                    onChange={e => { setTaskName(e.target.value) }}
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
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="On Hold">Other</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <div className="mt-1">
                  <Select
                    id="state"
                    name="state"
                    value={state}
                    onChange={e => { setState(e.target.value) }}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <div className="mt-1">
                  <Select
                    id="department"
                    name="department"
                    value={department}
                    onChange={e => { setDepartment(e.target.value) }}
                  >
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="HHRR">HHRR</option>
                    <option value="Security">Security</option>
                    <option value="WFM">WFM</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="value">Value</Label>
                <div className="mt-1">
                  <Select
                    id="value"
                    name="value"
                    value={value}
                    onChange={e => {
                      setValue(e.target.value);
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Mid">Mid</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <div className="mt-1">
                  <Select
                    id="owner"
                    name="owner"
                    value={owner}
                    onChange={e => {
                      setOwner(e.target.value);
                    }}
                  >
                    <option value="GMBPO Devs">GMBPO Devs</option>
                    <option value="Jorge">Jorge</option>
                    <option value="Abisai">Abisai</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="requester">Requester</Label>
                <div className="mt-1 mb-4">
                  <TextInput
                    id="requester"
                    name="requester"
                    value={requester}
                    onChange={e => {
                      setRequester(e.target.value);
                    }}
                  />
                </div>
              </div>

            </div>
            <div>
              <Label className="mt-2" htmlFor="description">Description</Label>
              <div className="mt-2">
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                  }}
                  style={{ overflow: 'hidden', height: '150px' }} />
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
      </> : <></>
  );
};



const DetailsTask: FC<any> = function ({ taskID, taskName2, status2, state2, department2, description2, value2, owner2, requester2, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);
  const [taskName, setTaskName] = useState(taskName2)
  const [status, setStatus] = useState(status2)
  const [state, setState] = useState(state2)
  const [department, setDepartment] = useState(department2)
  const [description, setDescription] = useState(description2)
  const [value, setValue] = useState(value2)
  const [owner, setOwner] = useState(owner2)
  const [requester, setRequester] = useState(requester2)
  const [nombre, setName] = useState("")
  const [porcentage, setPorcentage] = useState("")
  const [dataDetailsTask, setdataDetailsTask] = useState([] as any[])

  const [porcentages, setPorcentages] = useState(Array(dataDetailsTask.length).fill('')); // Inicializar array de estados


  console.log(setTaskName, setStatus, setState, setDepartment, setDescription, setValue, setOwner, setRequester);
  console.log(taskName, status, state, department, description, value, owner, requester);

  useEffect(() => {
    axios.post('https://bn.glassmountainbpo.com:8080/dev/taskDetailsList', {
      taskID,
    })
      .then((res) => {
        setdataDetailsTask(res.data);
        console.log(res.data)
      })
      .catch((error) => {
        console.error('Error en la solicitud POST:', error);
      });
  }, [sharedState]);


  const SaveTask_2 = (e: React.FormEvent, taskID: any, name: any, porcentaje: any, state: any, created_user: any, sharedState: any, updateSharedState: any) => {
    e.preventDefault();
    // Llamada a la función para eliminar detalles
    deleteTaskDetails(taskID);
    console.log(name + porcentaje + state + created_user + sharedState + updateSharedState)
  };


  const SaveTask_list = (e: React.FormEvent, taskID: any, name: any, porcentage_: any, state: any, created_user: any, sharedState: any, updateSharedState: any) => {
    e.preventDefault();
    // Llamada a la función para eliminar detalles
    updateTaskDetails(taskID, porcentage_);

    console.log(name + state + created_user + updateSharedState + sharedState)

  };

  const deleteTaskDetails = (taskID: any) => {
    axios.post('https://bn.glassmountainbpo.com:8080/dev/deletListTaskDetails', {
      taskID,

    })
      .then((res) => {
        // Manejar la respuesta según tus necesidades
        console.log(res.data);
        // Actualizar el sharedState aquí
        updateSharedState(res.data);
      })
      .catch((error) => {
        console.error('Error en la solicitud POST:', error);
      });
  };


  const updateTaskDetails = (taskID: any, porcentage_: any) => {

    axios.post('https://bn.glassmountainbpo.com:8080/dev/updateListTaskDetails', {
      taskID,
      porcentage_
    })
      .then((res) => {
        // Manejar la respuesta según tus necesidades
        console.log(res.data);
        // Actualizar el sharedState aquí
        updateSharedState(res.data);
      })
      .catch((error) => {
        console.error('Error en la solicitud POST:', error);
      });
  };

  useEffect(() => {
    // El código que necesitas ejecutar cada vez que sharedState cambie
    if (sharedState !== null) {
      // Hacer algo con el nuevo valor de sharedState
      console.log('sharedState actualizado:', sharedState);
    }
  }, [sharedState]);


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     const response = await axios.post('http://bn.glassmountainbpo.com:8080/dev/editTask', {
  //       taskID,
  //       taskName,
  //       status,
  //       state,
  //       department,
  //       description,
  //       value,
  //       owner,
  //       requester,
  //       created_user
  //     })
  //     if (response.status == 200) {
  //       const responseData = response.data;
  //       updateSharedState(!sharedState);
  //       setOpen(false);
  //       if (responseData.message === "Task updated successfully") {
  //         setOpen(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    created_user === "3199" || created_user === "3814" ?
      <>
        <Button className="text-white bg-blue-400 dark:bg-blue-700 dark:enabled:hover:bg-blue-500 dark:focus:ring-blue-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiEye className="text-lg" />
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Details Task</strong>
          </Modal.Header>
          <Modal.Body>

            <div className="grid grid-cols-2 gap-6 mt-2 sm:grid-cols-6">
              <div className="col-span-4">
                <Label htmlFor="taskID">Task Name:</Label>
                <div className="mt-1">
                  <TextInput
                    id="taskID"
                    name="taskID"
                    value={nombre}
                    onChange={e => {
                      setName(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label htmlFor="percentage">Percentage:</Label>
                <div className="mt-1">
                  <TextInput
                    id="percentage"
                    name="percentage"
                    value={porcentage}
                    onChange={e => {
                      setPorcentage(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-span-1 mt-7">
                <SaveUserModal taskID={taskID}
                  name={nombre}
                  porcentaje={porcentage}
                  state={''}
                  sharedState={sharedState}
                  updateSharedState={updateSharedState}></SaveUserModal>
              </div>
            </div>


            <Modal.Body className="border-b border-gray-200 !p-6 dark:border-gray-700">
            </Modal.Body>
            {
              dataDetailsTask.map((list, index) => {
                return <div className="grid grid-cols-1 gap-6 mt-2 sm:grid-cols-2">
                  {/* Primer bloque */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="text-base font-medium dark:text-white mb-2">{list.name}</div>
                  </div>

                  {/* Segundo bloque */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="text-base font-medium dark:text-white mb-2">{list.value + "%"}
                      <Progress progress={list.value} size="sm" />
                    </div>
                    <div className="flex space-x-2">

                      <Button color={"dark"} onClick={(e) => { SaveTask_2(e, list.id, list.name, list.value, list.state, created_user, sharedState, updateSharedState) }}>  <FaTimes className="text-xl" onClick={() => setOpen(true)} /></Button>
                      <TextInput
                        value={porcentages[index]}
                        onChange={(e) => {
                          const newPorcentages = [...porcentages];
                          newPorcentages[index] = e.target.value;
                          setPorcentages(newPorcentages);
                        }}
                      />
                      <Button onClick={(e) => { SaveTask_list(e, list.id, list.name, porcentages[index], list.state, created_user, sharedState, updateSharedState) }}>save</Button>
                    </div>
                  </div>
                </div>

              })
            }
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              href=""
            >
              Save
            </Button>
            {/* <Button
              color="primary"
              onClick={(e) => { handleSubmit(e); }}
            >
              Save
            </Button> */}
          </Modal.Footer>
        </Modal>
      </> : <>

        <Button className="text-white bg-blue-400 dark:bg-blue-700 dark:enabled:hover:bg-blue-500 dark:focus:ring-blue-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiEye className="text-lg" />
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Details Task</strong>
          </Modal.Header>
          <Modal.Body>

            <div className="grid grid-cols-2 gap-6 mt-2 sm:grid-cols-6">
            </div>
            {
              dataDetailsTask.map((list, index) => {

                console.log(index);
                return <div className="grid grid-cols-2 gap-6 mt-2 sm:grid-cols-2">
                  {/* Primer bloque */}

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="text-base font-medium dark:text-white mb-2">{list.name}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <Badge color={'gray'}><div className="flex items-center">
                      <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>{" "}
                      <span className="text-sm font-normal text-gray-900 dark:text-white">{list.value + '%'} Progress</span>
                    </div></Badge>
                    <Progress className="mt-4" progress={list.value} size="sm" />
                  </div>
                </div>
              })
            }
          </Modal.Body>

        </Modal>



      </>
  );
};


const DeleteUserModal: FC<any> = function ({ taskID, state, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent, taskID: any, state: any, created_user: any) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/dev/taskStateChange', {
        taskID,
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
        <Button color={(state == '1') ? "dark" : "dark"} onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            {(state == '1') ? <FaTimes color="white" className="text-lg" /> : <FaCheck color="white" className="text-lg" />}
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
          <Modal.Header className="px-6 pt-6 pb-0">
            <span className="sr-only">Delete user</span>
          </Modal.Header>
          <Modal.Body className="px-6 pt-0 pb-6">
            <div className="flex flex-col items-center gap-y-6 text-center">
              {(state == '1') ? <FaTimes className="text-7xl text-red-500" /> : <FaCheck className="text-7xl text-green-500" />}
              <p className="text-xl text-gray-500">
                {(state == '1') ? "Are you sure you want to deactivate this user?" : "Are you sure you want to activate this user?"}
              </p>
              <div className="flex items-center gap-x-3">
                <Button color={(state == '1') ? "failure" : "success"} onClick={(e) => { handleSubmit(e, taskID, state, created_user) }}>
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




const SaveUserModal: FC<any> = function ({ taskID, name, state, porcentaje, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);


  const SaveTask = async (e: React.FormEvent, taskID: any, name: any, state: any, porcentaje: any, created_user: any) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/dev/DetailsTask', {
        taskID,
        name,
        porcentaje,
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
        <Button color={(state == '1') ? "dark" : "dark"} onClick={() => setOpen(true)}>

          <div className="flex items-center gap-x-2">
            {(state == '1') ? <BiSave color="white" className="text-lg" /> : <BiSave color="white" className="text-xl" />}
          </div>
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
          <Modal.Header className="px-6 pt-6 pb-0">
            <span className="sr-only">Delete user</span>
          </Modal.Header>
          <Modal.Body className="px-6 pt-0 pb-6">
            <div className="flex flex-col items-center gap-y-6 text-center">
              {(state == '1') ? <BiSave className="text-7xl text-red-500" /> : <FaCheck className="text-7xl text-green-500" />}
              <p className="text-xl text-gray-500">
                {(state == '1') ? "Are you sure you want to deactivate this user?" : "Are you sure you want to activate this user?"}
              </p>
              <div className="flex items-center gap-x-3">
                <Button color={(state == '1') ? "failure" : "success"} onClick={(e) => { SaveTask(e, taskID, name, state, porcentaje, created_user) }}>
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

  // Function to convert an array to a CSV string
  const convertToCSV = (data: any) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => row[header]);
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
    a.download = 'users.csv';
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
    XLSX.writeFile(wb, 'users.xlsx');
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

const DeleteUsersModal: FC<any> = function ({ users, created_user, sharedState, updateSharedState }) {
  const [isOpen, setOpen] = useState(false);
  const dataToSend = users;

  const handleSubmit = async (e: React.FormEvent, dataToSend: string, created_user: any) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/api/deactivateUsers', {
        dataToSend,
        created_user
      })
      if (response.status == 200) {
        const responseData = response.data;
        updateSharedState(!sharedState);
        setOpen(false);


        if (responseData.message === "Users successfully deactivated") {
          setOpen(false);
        } else {
          console.log('Bad Fail')
        }
      }
    } catch (error) {
      console.log(error);
      setOpen(false);
    }
  };

  return (
    <a
      className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      <FaTimes className="text-2xl" onClick={() => setOpen(true)} />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user(s)</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <FaTimes className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to deactivate {users.length} user(s)?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={(e) => handleSubmit(e, dataToSend, created_user)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </a>
  );
};

const ActivateUsersModal: FC<any> = function ({ users, created_user, sharedState, updateSharedState }) {
  const [isOpen, setOpen] = useState(false);
  const dataToSend = users;

  const handleSubmit = async (e: React.FormEvent, dataToSend: string, created_user: any) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/api/activateUsers', {
        dataToSend,
        created_user
      })
      if (response.status == 200) {
        const responseData = response.data;
        updateSharedState(!sharedState);
        setOpen(false);

        if (responseData.message === "Users successfully activated") {
          setOpen(false);
        } else {
          console.log('Bad Fail')
        }
      }
    } catch (error) {
      console.log(error);
      setOpen(false);
    }
  };

  return (
    <a
      className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      <FaCheck className="text-2xl" onClick={() => setOpen(true)} />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Activate user(s)</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <FaCheck className="text-7xl text-green-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to activate {users.length} user(s)?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="success" onClick={(e) => handleSubmit(e, dataToSend, created_user)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </a>
  );
};

const CurrentTasksView: FC<any> = function ({ sharedState }: any) {
  const [data, setData] = useState<[MyDictionary, MyDictionary2[]] | null>(null);

  interface MyDictionary {
    tasksCount: number;
    tasksPending: number;
    tasksInProgress: number;
    tasksCompleted: number;
  }

  interface MyDictionary2 {
    count: number;
    department: string;
  }

  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/dev/dashboard')
      .then(res => setData(res.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [sharedState])

  const taskDictionary = data ? data[0] : 0;
  const taskArray = data ? data[1] : 0;

  //charts dashboard

  const options = {
    colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Organic",
        color: "#1A56DB",
        data: [
          { x: "Mon", y: 231 },
          { x: "Tue", y: 122 },
          { x: "Wed", y: 63 },
          { x: "Thu", y: 421 },
          { x: "Fri", y: 122 },
          { x: "Sat", y: 323 },
          { x: "Sun", y: 111 },
        ],
      },
      {
        name: "Social media",
        color: "#FDBA8C",
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: "420px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  }

  if (document.getElementById("column-chart") && typeof ApexCharts !== 'undefined') {
    const chart: any = new ApexCharts(document.getElementById("column-chart"), options);
    chart.render();
  }


  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 mb-5 sm:p-6 xl:p-8">


      <div className="grid grid-cols-2 gap-4 pt-2 mb-8 ">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">

        
          <div id="column-chart-1">


            <div className="grid grid-flow-col-6 pt-2 gap-4 divide-x-4 mb-8">
              <div className="max-w-auto w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                      <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                        <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                        <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">3.4k</h5>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p>
                    </div>
                  </div>
                  <div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                      <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                      </svg>
                      42.5%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <dl className="flex items-center">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Money spent:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">$3,232</dd>
                  </dl>
                  <dl className="flex items-center justify-end">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Conversion rate:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">1.2%</dd>
                  </dl>
                </div>

                <div id="column-chart"></div>
                <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                  <div className="flex justify-between items-center pt-5">

                    <button
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="lastDaysdropdown"
                      data-dropdown-placement="bottom"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                      type="button">
                      Last 7 days
                      <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>

                    <div id="lastDaysdropdown" className="z-10 hidden bg-white 00 rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                      Leads Report
                      <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">

          <div id="column-chart-2">


            <div className="grid grid-flow-col-6 pt-2 gap-4  mb-8 ">
              <div className="max-w-auto w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                      <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                        <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                        <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">3.4k</h5>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Leads generated per week</p>
                    </div>
                  </div>
                  <div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                      <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                      </svg>
                      42.5%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <dl className="flex items-center">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Money spent:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">$3,232</dd>
                  </dl>
                  <dl className="flex items-center justify-end">
                    <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Conversion rate:</dt>
                    <dd className="text-gray-900 text-sm dark:text-white font-semibold">1.2%</dd>
                  </dl>
                </div>

                <div id="column-chart"></div>
                <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                  <div className="flex justify-between items-center pt-5">

                    <button
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="lastDaysdropdown"
                      data-dropdown-placement="bottom"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                      type="button">
                      Last 7 days
                      <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>

                    <div id="lastDaysdropdown" className="z-10 hidden bg-white  rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                        </li>
                        <li>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                      Leads Report
                      <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>



      <h1 className="mb-6 text-xl ml-3 mt-1 font-semibold text-gray-900 dark:text-white sm:text-2xl">
        Developers' Active Tasks
      </h1>
      {taskDictionary != 0 ? (
        <div className="grid grid-flow-col pt-2 gap-4 divide-x-4 mb-8 divide-black dark:divide-white">
          <div className="row-span-2 text-right">
            <h1 className="text-7xl font-extrabold leading-none text-gray-900 dark:text-white">
              <CountUp
                start={0}
                end={taskDictionary.tasksCount}
                duration={1.5}
                separator=","
                decimals={0}
                decimal="."
                prefix=""
              ></CountUp>
            </h1>
            <h3 className="text-base font-normal text-gray-600 dark:text-blue-400">
              Assigned Tasks
            </h3>
          </div>
          <div className="pl-4">
            <div className="flex items-center">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-red-400"></span>{" "}
              <span className="text-xl font-normal text-gray-900 dark:text-white">{taskDictionary.tasksPending} Pending Approval</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-yellow-300 animate-pulse"></span>{" "}
              <span className="text-xl font-normal text-gray-900 dark:text-white">{taskDictionary.tasksInProgress} In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>{" "}
              <span className="text-xl font-normal text-gray-900 dark:text-white">{taskDictionary.tasksCompleted} Completed</span>
            </div>
          </div>
        </div>
      ) : <></>}
      <div className="grid justify-items-center">
        <table className="text-sm w-1/2 text-center">
          {taskArray != 0 ? taskArray.map((task, index) =>
            <tr id={"row" + index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-2 font-medium text-left text-gray-900 shadow-none whitespace-nowrap dark:text-white">
                {task.department}
              </td>
              <td className="px-6 py-2 text-right shadow-none whitespace-nowrap">
                <span className="rounded-lgpy-0.5 px-2.5 text-white text-sm font-bold">{task.count}</span>
              </td>
            </tr>
          ) : <></>}
        </table>
      </div>
    </div>

  );
};

const AcquisitionOverview: FC = function () {
  const [data, setData] = useState<Task[] | null>(null);

  interface Task {
    completed: number,
    department: string,
    in_progress: number,
    not_started: number,
    on_hold: number,
    other: number,
    progress: number,
    tasks: number
  }

  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/dev/overview')
      .then(res => setData(res.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [])

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 mb-5 sm:p-6 xl:p-8">
      <h1 className="mb-6 text-xl ml-3 mt-1 font-semibold text-gray-900 dark:text-white sm:text-2xl">
        Tasks Overview
      </h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table className="min-w-full table-fixed">
                <Table.Head>
                  <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Department
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Tasks
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Not Started
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    In Progress
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Completed
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    On Hold
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Other
                  </Table.HeadCell>
                  <Table.HeadCell className="min-w-[140px] whitespace-nowrap rounded-r border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Progress
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                  {data ? data.map((task, index) =>
                    <Table.Row id={"row" + index} className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                        {task.department}
                      </Table.Cell>
                      {task.tasks == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          {task.tasks}
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-yellow-100 text-sm font-bold">{task.tasks}</span>
                        </Table.Cell>
                      }
                      {task.not_started == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5">{task.not_started}</span>
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-red-300 text-sm font-bold">{task.not_started}</span>
                        </Table.Cell>
                      }
                      {task.in_progress == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5">{task.in_progress}</span>
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-yellow-200 text-sm font-bold">{task.in_progress}</span>
                        </Table.Cell>
                      }
                      {task.completed == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5">{task.completed}</span>
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-green-200 text-sm font-bold">{task.completed}</span>
                        </Table.Cell>
                      }
                      {task.on_hold == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5">{task.on_hold}</span>
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-indigo-200 text-sm font-bold">{task.on_hold}</span>
                        </Table.Cell>
                      }
                      {task.other == 0 ?
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5">{task.other}</span>
                        </Table.Cell> :
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          <span className="rounded-lg bg-purple-200 py-0.5 px-2.5 text-gray-800 dark:bg-indigo-200 text-sm font-bold">{task.other}</span>
                        </Table.Cell>
                      }
                      <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                        <div className="flex items-center">
                          <span className="mr-2 text-xs font-medium">{task.progress}%</span>
                          <div className="relative w-full">
                            <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-2 rounded-sm bg-primary-700"
                                style={{ width: task.progress + "%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : <></>}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DevsDashboard;