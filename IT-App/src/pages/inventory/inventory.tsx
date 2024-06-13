/* eslint-disable jsx-a11y/anchor-is-valid */
import { Label, Table, TextInput, Dropdown, Checkbox as FlowbiteCheckbox, Button, Modal, Select } from "flowbite-react";
import React, { SetStateAction, useState, useEffect, type FC } from "react";
import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import { InventoryItem, AssetItem, BrandItem, ModelItem, CategoryItem } from "../../types";
import { HiDocumentDownload, HiOutlinePencilAlt, HiPlus, HiRefresh } from "react-icons/hi";
import axios from "axios";
import CryptoJS from "crypto-js";
import { FaTimes } from "react-icons/fa";
const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");


const Inventory: FC = function () {
  const [grandTotalData, setGrandTotalData] = useState<{ [key: string]: InventoryItem[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sharedState, setSharedState] = useState(false);

  const updateSharedState = (newValue: boolean) => {
    setSharedState(newValue);
  }

  const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchInput(e.target.value);
  };

  //Prevent user from using the Enter key when using the search/filter bar
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const checkboxArray: string[] = [];

  const updateCheckboxArray = (producto: string) => {
    const checkbox = document.getElementById(producto + "Checkbox") as HTMLInputElement;
    if (checkbox.checked) {
      checkboxArray.push(producto)
    } else {
      const indexToRemove = checkboxArray.indexOf(producto);
      checkboxArray.splice(indexToRemove, 1);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<InventoryItem[]>('https://bn.glassmountainbpo.com:8080/inventory/general');
        const organizedData = response.data.reduce<{ [key: string]: InventoryItem[] }>((acc, item) => {
          if (!acc[item.asset]) {
            acc[item.asset] = [];
          }
          // @ts-ignore
          acc[item.asset].push(item);
          return acc;
        }, {});
        setGrandTotalData(organizedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        // @ts-ignore
        setError('Error fetching data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const toggleRow = (asset: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(asset)) {
      newExpandedRows.delete(asset);
    } else {
      newExpandedRows.add(asset);
    }
    setExpandedRows(newExpandedRows);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <NavbarSidebarLayout2 isFooter={true}>
      <div className="block items-center justify-between border-b rounded-tl-2xl rounded-tr-2xl border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 style={{ zoom: 0.90 }} className="text-xl ml-4 mt-4 font-semibold text-gray-900 dark:text-white sm:text-2xl">
              IT Equipment Inventory
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
                  href="/Inventory"
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
            <div className="ml-auto mr-4 flex items-center space-x-2 sm:space-x-3">
                  <AddTaskModal
                    sharedState={sharedState}
                    updateSharedState={updateSharedState} />
                  <ExportModal
                    data={grandTotalData} />
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
                  <Table.HeadCell className="">Asset</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Total Quantity</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Total Price</Table.HeadCell>
                  <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {
                    Object.keys(grandTotalData).map((asset) => (
                      <React.Fragment key={asset}>
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className=" text-primary-800 font-bold px-2 py-0.5 rounded dark:text-white">
                            {asset}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className="bg-green-600 text-green-200 font-semibold px-2 py-0.5 rounded dark:bg-green-700 dark:text-green-200">
                            {grandTotalData[asset]!.reduce((total, item) => total + item.quantity, 0)}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className="bg-yellow-600 text-yellow-200 font-semibold px-2 py-0.5 rounded dark:bg-yellow-400 dark:text-yellow-900">
                            {grandTotalData[asset]!.reduce((total, item) => total + parseFloat(item.totalPrice), 0).toFixed(2)}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => toggleRow(asset)}
                  >
                    {expandedRows.has(asset) ? 'Collapse' : 'Expand'}
                  </button>
                        </Table.Cell>
                      </Table.Row>
                      {expandedRows.has(asset) && (
                <tr>
                <td colSpan={4} className="py-4 px-4">
                  <div className="dark:bg-gray-800 p-2">
                    <Table className="min-w-full border-gray-300">
                      <Table.Head>
                            <Table.HeadCell className="py-2 px-4 border-b">Asset</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Brand</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Model</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Quantity</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Category</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Total Price</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Details</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Vendor</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Date Created</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Actions</Table.HeadCell>
                      </Table.Head>
                      <Table.Body>
                          {grandTotalData[asset]!.map((detail) => (
                            <React.Fragment key={detail.id}>
                              <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Table.Cell className="py-2 px-4 border-b">{detail.asset}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.brand}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.model}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.quantity}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.category}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.totalPrice}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.details}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.vendor}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">{detail.dateTime}</Table.Cell>
                              <Table.Cell className="py-2 px-4 border-b">
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditAssetModal
                                  // id={item.id}
                                  // status2={item.status}
                                  // agentBadge2={item.agentBadge}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                                <DeleteAssetModal
                                  batchID = {detail.batchID}
                                  created_user={created_user}
                                  sharedState={sharedState}
                                  updateSharedState={updateSharedState}
                                />
                              </div>
                              </Table.Cell>
                              </Table.Row>
                            </React.Fragment>
                          ))}
                        </Table.Body>
                    </Table>
                  </div>
                </td>
              </tr>
            )}
                      </React.Fragment>
                    ))
                  }
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout2>
  );
};

const AddTaskModal: FC<any> = function ({ sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);
  const [ticketID, setTicketID] = useState('');
  const [asset, setAsset] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [assetList, setAssetList] = useState<AssetItem[]>([]);
  const [brandList, setBrandList] = useState<BrandItem[]>([]);
  const [modelList, setModelList] = useState<ModelItem[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://bn.glassmountainbpo.com:8080/inventory/listCategory2');
        setAssetList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://bn.glassmountainbpo.com:8080/inventory/listBrand2');
        setBrandList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://bn.glassmountainbpo.com:8080/inventory/listModels2');
        setModelList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://bn.glassmountainbpo.com:8080/inventory/listCategories2');
        setCategoryList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);

  const url = 'https://bn.glassmountainbpo.com:8080/inventory/addInventory2'
  const handleSubmit = async (e: React.FormEvent) => {
    if (!asset) {
      alert('Enter a valid Asset!')
    } else if (!brand) {
      alert('Enter a valid Brand!')
    } else if (!model) {
      alert('Enter a valid Model!')
    } else if (!quantity) {
      alert('Enter a valid Quantity!')
    } else if (!category) {
      alert('Enter a valid Category!')
    } else {
      e.preventDefault()
      try {
        const response = await axios.post(url, {
          ticketID,
          asset,
          brand,
          model,
          quantity,
          category,
          vendor,
          details,
          price,
          receivedBy,
          created_user
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);

          if (responseData.message === "Success") {
            setOpen(false);
            resetFields();
            alert('Success!')
          } else {
            console.log('Fatal Error')
          }
        }
      } catch (error) {
        console.log(error);
        setOpen(false)
      }
    }
  }

  const resetFields = () => {
    setTicketID('');
    setAsset('');
    setBrand('');
    setModel('');
    setQuantity('');
    setCategory('');
    setVendor('');
    setDetails('');
    setPrice('');
    setReceivedBy('');
  }

  return (
    <>
      <Button color="primary" onClick={() => { setOpen(true) }}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Asset(s)
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add Asset(s)</strong>
        </Modal.Header>
        <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="account">Ticket ID</Label>
                <div className="mt-1">
                    <TextInput
                    placeholder="TCKT001"
                    value={ticketID}
                    onChange={e => setTicketID(e.target.value)}
                    />
                </div>
              </div>
              <div>
                <Label htmlFor="Asset">Asset (Required)</Label>
                <div className="mt-1">
                  <Select
                  id='asset'
                  name='asset'
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  required
                  >
                    {assetList.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                    </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="Brand">Brand (Required)</Label>
                <div className="mt-1">
                <Select
                  id='brand'
                  name='brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  >
                    {brandList.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                    </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="Model">Model (Required)</Label>
                <div className="mt-1">
                <Select
                  id='model'
                  name='model'
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  >
                    {modelList.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                    </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="Quantity">Quantity (Required)</Label>
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
              <div>
                <Label htmlFor="Category">Category (Required)</Label>
                <div className="mt-1">
                <Select
                  id='category'
                  name='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  >
                    {categoryList.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                    </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="Vendor">Vendor</Label>
                <div className="mt-1">
                  <TextInput
                    id="vendor"
                    name="vendor"
                    placeholder="Wallmart"
                    value={vendor}
                    onChange={e => {
                      setVendor(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="Details">Details</Label>
                <div className="mt-1">
                  <TextInput
                    id="details"
                    name="details"
                    placeholder="Details"
                    value={details}
                    onChange={e => {
                      setDetails(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="Price">Price</Label>
                <div className="mt-1">
                  <TextInput
                    type="number"
                    id="price"
                    name="price"
                    placeholder="10"
                    value={price}
                    onChange={e => {
                      setPrice(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="Received By">Received By</Label>
                <div className="mt-1">
                  <TextInput
                    id="receivedBy"
                    name="receivedBy"
                    placeholder="John Doe"
                    value={receivedBy}
                    onChange={e => {
                      setReceivedBy(e.target.value);
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
              onClick={(e) => { handleSubmit(e) }}
              >
              Add Asset
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const EditAssetModal: FC<any> = function ({ sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        <Button className="text-white bg-green-400 dark:bg-green-400 dark:enabled:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiOutlinePencilAlt className="text-sm" />
  
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
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taskName">Agent's Badge</Label>
                <div className="mt-1">
                  <TextInput
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <div className="mt-1">
                  <Select
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                  </Select>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  
  const DeleteAssetModal: FC<any> = function ({ batchID, sharedState, updateSharedState }: any) {
    const [isOpen, setOpen] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent, batchID: any, created_user: any) => {
      e.preventDefault()
      try {
        const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/deactivate', {
          batchID,
          created_user
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);
          setOpen(false);
  
          if (responseData.message === "Success") {
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
          <Button onClick={() => setOpen(true)}>
            <div className="flex items-center gap-x-2">
            <FaTimes color="white" className="text-sm" />
            </div>
          </Button>
          <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
            <Modal.Header className="px-6 pt-6 pb-0">
              <span className="sr-only">Delete asset</span>
            </Modal.Header>
            <Modal.Body className="px-6 pt-0 pb-6">
              <div className="flex flex-col items-center gap-y-6 text-center">
                <FaTimes className="text-7xl text-red-500" />
                <p className="text-xl text-gray-500">
                  "Are you sure you want to delete this asset?"
                </p>
                <div className="flex items-center gap-x-3">
                  <Button color="failure" onClick={(e) => { handleSubmit(e, batchID, created_user) }}>
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

  const ExportModal: FC<any> = function (grandTotalData) {
    const [isOpen, setOpen] = useState(false);

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
                {/* <Button onClick={exportToCSV} color="light">
                  <div className="flex items-center gap-x-3">
                    <FiletypeCsv className="text-xl" />
                    <span>Export CSV</span>
                  </div>
                </Button> */}
              </div>
              <div>
                {/* <Button onClick={exportToXLS} color="light">
                  <div className="flex items-center gap-x-3">
                    <FiletypeXlsx className="text-xl" />
                    <span>Export XLSX</span>
                  </div>
                </Button> */}
              </div>
            </div>
          </Modal.Body>
  
        </Modal>
      </>
    )
  
  }


export default Inventory;