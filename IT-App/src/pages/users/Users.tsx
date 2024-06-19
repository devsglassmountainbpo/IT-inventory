/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Table,
    TextInput,
    Select,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, SetStateAction, useRef } from "react"
import {
    // HiChevronLeft,
    // HiChevronRight,
    HiRefresh,
    HiDocumentDownload,
    HiHome,
    HiOutlinePencilAlt,
    HiPlus,
} from "react-icons/hi";
import { FaUserCheck, FaUserSlash } from "react-icons/fa"
//import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { FiletypeCsv, FiletypeXlsx } from 'react-bootstrap-icons';

import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";

import CryptoJS from "crypto-js";

import * as XLSX from 'xlsx';


const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");

const ArrayBagde = ['3199', '3814', '3897', '2181'];
const condicion = ArrayBagde.includes(created_user) ? '1' : '0';
console.log('========Esta es la condicion:', condicion);


const UserListPage: FC = function () {

    const [data, setData] = useState([] as any[]);
    const created_user3 = localStorage.getItem("badgeSession") || "";
    const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
    const created_user = created_user2.toString(CryptoJS.enc.Utf8);
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
        axios.get('https://bn.glassmountainbpo.com:8080/inventory/users')
            .then(res => setData(res.data))
    }, [sharedState])

    const [searchInput, setSearchInput] = useState('');
    const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchInput(e.target.value);
    };


    //Avatars




    useEffect(() => {
        if (searchInput !== '') {
            const foo = data;
            let filteredRawData = foo.filter((user) => {
                return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
            })
            if (sortByName === true) {
                filteredRawData = filteredRawData.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1);
            }
            if (sortbyPosition === true) {
                filteredRawData = filteredRawData.sort((a, b) => (a.id_job > b.id_job) ? 1 : -1);
            }
            if (sortByDepartment === true) {
                filteredRawData = filteredRawData.sort((a, b) => (a.id_rol > b.id_rol) ? 1 : -1);
            }
            if (sortByStatus === true) {
                filteredRawData = filteredRawData.sort((a, b) => a.status - b.status);
            }
            setFilteredResults(filteredRawData);
            resetCheckboxes();
        } else {
            let foo = data;
            if (sortByName === true) {
                foo = foo.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1);
            }
            if (sortbyPosition === true) {
                foo = foo.sort((a, b) => (a.id_job > b.id_job) ? 1 : -1);
            }
            if (sortByDepartment === true) {
                foo = foo.sort((a, b) => (a.id_rol > b.id_rol) ? 1 : -1);
            }
            if (sortByStatus === true) {
                foo = foo.sort((a, b) => a.status - b.status);
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
            if (header === "status") {
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

    //avatars
    const variants: any = [
        "variant0101", "variant0102", "variant0103", "variant0104", "variant0105",
        "variant0201", "variant0202", "variant0203", "variant0204", "variant0205",
        "variant0301", "variant0302", "variant0303", "variant0304", "variant0305",
        "variant0401", "variant0402", "variant0403", "variant0404", "variant0405",
        "variant0501", "variant0502", "variant0503", "variant0504", "variant0505",
        "variant0601", "variant0602", "variant0603", "variant0604", "variant0605",
        "variant0701", "variant0702", "variant0703", "variant0704", "variant0705",
        "variant0706", "variant0707", "variant0708"
    ];

    const [avatarUrl, setAvatarUrl] = useState('');


    const getRandomVariant: any = (variants: string | any[]) => {
        const randomIndex = Math.floor(Math.random() * variants.length);
        return variants[randomIndex];
    };

    useEffect(() => {
        const variant = getRandomVariant(variants);
        const url = `https://api.dicebear.com/8.x/big-ears-neutral/svg?mouth=${variant}`;
        setAvatarUrl(url);
    }, []);

    const handleClick = () => {
        const variant = getRandomVariant(variants);
        const url = `https://api.dicebear.com/8.x/big-ears-neutral/svg?mouth=${variant}`;
        setAvatarUrl(url);
    };

    return (
        <NavbarSidebarLayout2 isFooter={true}>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb className="mb-4">
                            <Breadcrumb.Item href="/Dashboard">
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span className="dark:text-white">Home</span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="/users">Users</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            All users
                        </h1>
                    </div>
                    <div className="sm:flex">
                        <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                            <form className="lg:pr-3">
                                <Label htmlFor="users-search" className="sr-only">
                                    Search
                                </Label>
                                <div className="relative mt-1 lg:w-64 xl:w-96">
                                    <TextInput
                                        id="users-search"
                                        name="users-search"
                                        placeholder="Search for users"
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

                                {condicion == '1' ? <>
                                    <DeleteUsersModal
                                        users={checkboxArray}
                                        created_user={created_user}
                                        sharedState={sharedState}
                                        updateSharedState={updateSharedState} />
                                    <ActivateUsersModal
                                        users={checkboxArray}
                                        created_user={created_user}
                                        sharedState={sharedState}
                                        updateSharedState={updateSharedState} />
                                </> : <></>}

                            </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                            <AddUserModal />
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
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" style={{ zoom: 0.90 }}>
                                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                                    <Table.HeadCell >
                                        <Label htmlFor="select-all" className="sr-only">
                                            Select all
                                        </Label>

                                        <Checkbox id="select-all" name="select-all" ref={checkboxRef} onChange={handleSelectAll} />
                                    </Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "name")} >Username</Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "position")} >Position</Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "department")}>Department</Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "status")}>Status</Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "email")}>Email</Table.HeadCell>
                                    <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500" onClick={(e) => handleSortClick(e, "status")}>Role</Table.HeadCell>
                                    {condicion == '1' ? <>
                                        <Table.HeadCell>Actions</Table.HeadCell>
                                    </> : <>
                                        <Table.HeadCell></Table.HeadCell>
                                    </>}
                                    <Table.HeadCell>Avatars</Table.HeadCell>
                                </Table.Head >
                                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {
                                        (searchInput.length > 1 ? filteredResults : (dataTemp.length === 0 ? data : (sortByName === true || sortbyPosition === true || sortByDepartment === true ? dataTemp : data))).map((user, index) => {
                                            return (
                                                <Table.Row key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <Table.Cell className="w-4 p-4">
                                                        <div className="flex items-center">
                                                            <Checkbox id={"checkbox-" + user.badge} value={user.badge} name="usersCheckbox" onChange={() => updateCheckboxArray(user.badge)} />
                                                            <label htmlFor={"checkbox-" + user.badge} className="sr-only">
                                                            </label>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0" >
                                                        <div
                                                            style={{
                                                                width: '45px',
                                                                height: '45px',
                                                                overflow: 'hidden',
                                                                borderRadius: '50%',
                                                            }}
                                                        >
                                                            <img
                                                                src={`https://hr.glassmountainbpo.com/ap/employee/document/foto/${user.photo || 'user.png'}`}
                                                                alt="user"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                            <div id={"username" + user.badge} className="text-base font-semibold text-gray-900 dark:text-white">
                                                                {user.username}
                                                            </div>
                                                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                {user.badge + " - " + (user.name ? user.name : "N/A")}
                                                            </div>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                        {(user.id_job ? user.id_job : "N/A")}
                                                    </Table.Cell>
                                                    <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                        {(user.id_rol ? user.id_rol : "N/A")}
                                                    </Table.Cell>
                                                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                                                        <div className="flex items-center">
                                                            <div className={`mr-2 h-2.5 w-2.5 rounded-full ${(user.status == 1) ? 'bg-green-400' : 'bg-red-400'}`}></div>{" "}
                                                            {(user.status == '1') ? <span>Active</span> : <span>Inactive</span>}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                        {(user.email ? user.email : "N/A")}
                                                    </Table.Cell>
                                                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                                                        <div className="flex items-center">
                                                            <div className={`mr-2 h-3.5 w-0.5 rounded-full ${(user.role == 1) ? 'bg-green-400' : 'bg-yellow-400'}`}></div>{" "}
                                                            {(user.role === '1') ? <span>Administrator</span> :
                                                                (user.role === '2') ? <span>Supervisor</span> :
                                                                    <span>Other</span>}
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex items-center gap-x-3 whitespace-nowrap">

                                                            {
                                                                condicion == '1' ? <>
                                                                    <EditUserModal
                                                                        badge={user.badge}
                                                                        username={user.username}
                                                                        userDepartment={user.id_rol}
                                                                        userPosition={user.id_job}
                                                                        status={user.status}
                                                                        created_user={created_user}
                                                                        id_rol={user.id_rolN}
                                                                        email={user.email}
                                                                        role={user.role}
                                                                        sharedState={sharedState}
                                                                        updateSharedState={updateSharedState}
                                                                    />
                                                                    <DeleteUserModal
                                                                        badge={user.badge}
                                                                        status={user.status}
                                                                        created_user={created_user}
                                                                        sharedState={sharedState}
                                                                        updateSharedState={updateSharedState}
                                                                    />
                                                                </> : <>

                                                                </>
                                                            }

                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell onClick={handleClick}>

                                                        <div key={index}
                                                            style={{
                                                                width: '45px',
                                                                height: '45px',
                                                                overflow: 'hidden',
                                                                // borderRadius: '50%',
                                                            }}
                                                        >
                                                            {/* <img
                                                                src="https://api.dicebear.com/8.x/big-ears-neutral/svg?mouth=variant0707"
                                                                alt="avatar"
                                                                style={{
                                                                    width: '70%',
                                                                    height: '70%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            /> */}
                                                            <img
                                                                src={avatarUrl}
                                                                alt="avatar"
                                                                style={{
                                                                    width: '70%',
                                                                    height: '70%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        </div>


                                                    </Table.Cell>
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

// const GetUserInfo: FC<any> = function (badge: any) {
//   const [hiredData, setHiredData] = useState<any>([]);

//   useEffect(() => {
//     axios.get('http://bn.glassmountainbpo.com:8080/api/hired/' + Object.values(badge))
//     .then((res) => {setHiredData(res.data)})
//     .catch(error => console.log(error))
//   }, [])

//   return (
//     <>
//     {hiredData.badge}
//     </>
//   )
// };

const AddUserModal: FC = function () {
    const [isOpen, setOpen] = useState(false);

    const url = `https://bn.glassmountainbpo.com:8080/gift/hired/`;

    const [result, setResult] = useState<any>([]); //JSON Axios Data
    const [badge, setBadge] = useState<any>(''); //Badge
    const [username, setUsername] = useState<any>('');
    const created_user3 = localStorage.getItem("badgeSession") || "" //Badge de la sesion
    const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "")
    const created_user = created_user2.toString(CryptoJS.enc.Utf8);
    const [password, setPassword] = useState<any>('');

    const [role, setRole] = useState<any>(''); //Badge
    const [email, setEmail] = useState<any>(''); //Badge


    const handleTrack = () => {
        if (badge.length !== 0) {
            // Do something with value

            axios.get(url + badge)
                .then((response) => {
                    setResult(response.data)
                    // axios returns API response body in .data
                });
        }
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === "Enter") {
            handleTrack();
        }
    };

    const handleSubmit = async (e: React.FormEvent, id_rol: any, id_job: any) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://bn.glassmountainbpo.com:8080/invetory_users/save', {
                badge,
                username,
                password,
                id_rol,
                created_user,
                id_job,
                role,
                email,
            })
            if (response.status == 200) {
                const responseData = response.data;
                location.reload()

                if (responseData.message === "Usuario guardado exitosamente") {
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
        <>
            <Button color="primary" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Add user
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
                    <strong>Add new user</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="badge">Badge</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="badgeAddUser"
                                    name="badgeAddUser"
                                    placeholder="3814"
                                    value={badge}
                                    onChange={e => {
                                        setBadge(e.target.value);
                                    }}
                                    onKeyDown={(e) => handleKeyPress(e)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="fullname">Full name</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="fullname"
                                    name="fullname"
                                    placeholder="John Doe"
                                    value={result.first_name !== undefined ? result.first_name + " " + result.first_last_name : ""}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="position">Position</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="position"
                                    name="position"
                                    placeholder="Developer"
                                    value={result !== undefined ? result.name_job : " "}
                                    readOnly
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="department"
                                    name="department"
                                    placeholder="IT"
                                    value={result !== undefined ? result.name_rol : " "}
                                    readOnly
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="username"
                                    name="username"
                                    placeholder="username"
                                    autoComplete="off"
                                    onChange={e => {
                                        setUsername(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="comppasswordany"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                    autoComplete="off"
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="password">Role</Label>
                            <div className="mt-1">
                                <Select
                                    id="comppasswordany"
                                    name="password"
                                    autoComplete="off"
                                    onChange={e => {
                                        setRole(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="1">Administrator</option>
                                    <option value="2">Supervisor</option>
                                    <option value="3">Other</option>
                                </Select>

                            </div>
                        </div>

                        <div>
                            <Label htmlFor="username">Email</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="username"
                                    name="username"
                                    placeholder="username"
                                    autoComplete="off"
                                    onChange={e => {
                                        setEmail(e.target.value);
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
                        onClick={(e) => { handleSubmit(e, result.id_rol, result.id_puesto); }}>
                        Add user
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const EditUserModal: FC<any> = function ({ badge, username, userDepartment, userPosition, status, created_user, id_rol, email, role, sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
    const [password, setPassword] = useState<any>('');
    // const [username2, setUsername2] = useState<any>('');
    const [sendEmail, sendsetEmail] = useState<any>('');
    const [sendRole, sendsetRole] = useState<any>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        //username2 !== '' ? username = username2 : username = username;
        sendEmail !== '' ? email = sendEmail : email = email;
        sendRole !== '' ? role = sendRole : role = role;
        username = username;
        try {
            const response = await axios.post('https://bn.glassmountainbpo.com:8080/user_IT/edit', {
                badge,
                username,
                password,
                id_rol,
                created_user,
                email,
                role

            })
            if (response.status == 200) {
                const responseData = response.data;
                updateSharedState(!sharedState);
                setOpen(false);

                if (responseData.message === "Usuario actualizado exitosamente") {
                    setOpen(false);
                } else {
                    console.log("Fatal Error");
                }
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
        }
    };

    return (
        <>
            <Button className="text-white bg-green-400  dark:bg-green-400 dark:enabled:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-2">
                    <HiOutlinePencilAlt className="text-lg" />

                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
                    <strong>Edit user</strong>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="badge">Badge</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="badge"
                                    name="badge"
                                    placeholder="3814"
                                    value={badge}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="Status">Status</Label>
                            <div className="mt-1">
                                <TextInput value={status == 1 ? 'Active' : 'Inactive'} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="position">Position</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="position"
                                    name="position"
                                    placeholder="Developer"
                                    value={userPosition}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="department"
                                    name="department"
                                    placeholder="IT"
                                    value={userDepartment}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="username"
                                    name="username"
                                    placeholder="jsmith02"
                                    value={username}
                                // onChange={e => {
                                //     setUsername2(e.target.value);
                                // }}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email" placeholder="a@a.com"
                                    // value={email}
                                    onChange={e => {
                                        sendsetEmail(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Role</Label>
                            <div className="mt-1">
                                <Select
                                    id="role"
                                    name="role"
                                    autoComplete="off"
                                    // value={role}
                                    onChange={e => {
                                        sendsetRole(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">Selected</option>
                                    <option value="1">Administrator</option>
                                    <option value="2">Supervisor</option>
                                    <option value="3">Other</option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="mt-1">
                                <TextInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={(e) => { handleSubmit(e); }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const DeleteUserModal: FC<any> = function ({ badge, status, created_user, sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent, badge: any, status: any, created_user: any) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/statusIT', {
                badge,
                status,
                created_user
            })
            if (response.status == 200) {
                const responseData = response.data;
                updateSharedState(!sharedState);
                setOpen(false);

                if (responseData.message === "Usuario actualizado exitosamente") {
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
        <>
            <Button color={(status == '1') ? "dark" : "dark"} onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-2">
                    {(status == '1') ? <FaUserSlash color="white" className="text-lg" /> : <FaUserCheck color="white" className="text-lg" />}
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="px-6 pt-6 pb-0">
                    <span className="sr-only">Delete user</span>
                </Modal.Header>
                <Modal.Body className="px-6 pt-0 pb-6">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        {(status == '1') ? <FaUserSlash className="text-7xl text-red-500" /> : <FaUserCheck className="text-7xl text-green-500" />}
                        <p className="text-xl text-gray-500">
                            {(status == '1') ? "Are you sure you want to deactivate this user?" : "Are you sure you want to activate this user?"}
                        </p>
                        <div className="flex items-center gap-x-3">
                            <Button color={(status == '1') ? "failure" : "success"} onClick={(e) => { handleSubmit(e, badge, status, created_user) }}>
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
            const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/desactivateUsers', {
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
            <FaUserSlash className="text-2xl" onClick={() => setOpen(true)} />
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="px-6 pt-6 pb-0">
                    <span className="sr-only">Delete user(s)</span>
                </Modal.Header>
                <Modal.Body className="px-6 pt-0 pb-6">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <FaUserSlash className="text-7xl text-red-500" />
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
            const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/activateUsers', {
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
            <FaUserCheck className="text-2xl" onClick={() => setOpen(true)} />
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="px-6 pt-6 pb-0">
                    <span className="sr-only">Activate user(s)</span>
                </Modal.Header>
                <Modal.Body className="px-6 pt-0 pb-6">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <FaUserCheck className="text-7xl text-green-500" />
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

// export const Pagination: FC = function () {
//   return (
//     <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
//       <div className="mb-4 flex items-center sm:mb-0">
//         <a
//           href="#"
//           className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//         >
//           <span className="sr-only">Previous page</span>
//           <HiChevronLeft className="text-2xl" />
//         </a>
//         <a
//           href="#"
//           className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//         >
//           <span className="sr-only">Next page</span>
//           <HiChevronRight className="text-2xl" />
//         </a>
//         <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//           Showing&nbsp;
//           <span className="font-semibold text-gray-900 dark:text-white">
//             1-10
//           </span>
//           &nbsp;of&nbsp;
//           <span className="font-semibold text-gray-900 dark:text-white">
//             229
//           </span>
//         </span>
//       </div>
//       <div className="flex items-center space-x-3">
//         <a
//           href="#"
//           className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//         >
//           <HiChevronLeft className="mr-1 text-base" />
//           Previous
//         </a>
//         <a
//           href="#"
//           className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//         >
//           Next
//           <HiChevronRight className="ml-1 text-base" />
//         </a>
//       </div>
//     </div>
//   );
// };

export default UserListPage;