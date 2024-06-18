/* eslint-disable jsx-a11y/anchor-is-valid */
import { Label, Table, TextInput, Dropdown, Checkbox as FlowbiteCheckbox, Button, Modal, Select } from "flowbite-react";
import React, { SetStateAction, useState, useEffect, type FC } from "react";
import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import { InventoryItem, AssetItem, BrandItem, ModelItem, CategoryItem } from "../../types";
import { HiDocumentDownload, HiOutlinePencilAlt, HiPlus, HiFolderAdd , HiOutlineDotsVertical  } from "react-icons/hi";
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
  }, [sharedState]);

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
            {/* <div className="mb-3 ml-4 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
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
            </div> */}
            <div className="ml-auto mr-4 flex items-center space-x-2 sm:space-x-3">
              <AddTaskModal
                sharedState={sharedState}
                updateSharedState={updateSharedState} />
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
                  {/* <Table.HeadCell className="hover:cursor-pointer hover:text-blue-500">Actions</Table.HeadCell> */}
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {
                    Object.keys(grandTotalData).map((asset) => (
                      <React.Fragment key={asset}>
                        <Table.Row onClick={() => toggleRow(asset)} className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:ring-purple-300">
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            <span className="flex items-center text-primary-800 font-semibold px-7 py-4 rounded dark:text-white ">
                              <HiFolderAdd  className="mr-2 ml-1 text-xl" />  {/* Añade margen derecho para separar el ícono del texto */}
                              <h1 className="text-ms">{asset}</h1>
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
                          {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                        <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => toggleRow(asset)}
                  >
                    {expandedRows.has(asset) ? 'Collapse' : 'Expand'}
                  </button>
                        </Table.Cell> */}
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
                                                ticketID={detail.idTickets}
                                                asset={detail.asset}
                                                brand={detail.brand}
                                                model={detail.model}
                                                maxQuantity={detail.quantity}
                                                currentCategory={detail.category}
                                                id={detail.id}
                                                batchID={detail.batchID}
                                                vendor={detail.vendor}
                                                details={detail.details}
                                                price={detail.totalPrice}
                                                receivedBy={detail.receivedBy}
                                                sharedState={sharedState}
                                                updateSharedState={updateSharedState}
                                              />
                                              <DeleteAssetModal
                                                ID={detail.id}
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
                  <option>Select</option>
                  {assetList
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item, index) => (
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

                  <option value='N/A'>N/A</option>
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
                  <option value='N/A'>N/A</option>
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

const EditAssetModal: FC<any> = function ({ ticketID, asset, brand, model, maxQuantity, currentCategory, id, batchID, vendor, details, price, receivedBy, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(maxQuantity)
  const [newCategory, setNewCategory] = useState('')
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);

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

  const handleQuantityChange = (e: { target: { value: string; }; }) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value > maxQuantity) {
        setQuantity(maxQuantity);
      } else if (value < 1) {
        setQuantity(1);
      } else {
        setQuantity(value);
      }
    } else {
      setQuantity('');
    }
  };

  const url = 'https://bn.glassmountainbpo.com:8080/inventory/move'
  const handleSubmit = async (e: React.FormEvent) => {
    if (!quantity) {
      alert('Enter a valid Quantity!')
    } else if (!newCategory) {
      alert('Enter a valid Category!')
    } else {
      e.preventDefault()
      try {
        const response = await axios.post(url, {
          ticketID,
          asset,
          brand,
          model,
          id,
          batchID,
          maxQuantity,
          quantity,
          currentCategory,
          newCategory,
          vendor,
          details,
          price,
          receivedBy,
          created_user
        })
        if (response.status == 200) {
          const responseData = response.data;
          updateSharedState(!sharedState);

          if (responseData.result === "Success") {
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
    setNewCategory('');
    setQuantity('');

  }

  return (
    <>
      <Button className="text-white bg-green-400 dark:bg-green-400 dark:enabled:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-sm" />

        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Move asset: </strong><p> {brand} {model} ({quantity})</p>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="id">Quantity to move</Label>
              <div className="mt-1">
                <TextInput
                  id="id"
                  type="number"
                  name="id"
                  value={quantity}
                  max={maxQuantity}
                  min='1'
                  onChange={handleQuantityChange}
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
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                >
                  <option>Select</option>
                  {categoryList.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={(e) => { handleSubmit(e) }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


const DeleteAssetModal: FC<any> = function ({ ID, sharedState, updateSharedState }: any) {
  const [isOpen, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent, ID: any, created_user: any) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://bn.glassmountainbpo.com:8080/inventory/deactivate', {
        ID,
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
              <Button color="failure" onClick={(e) => { handleSubmit(e, ID, created_user) }}>
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

export default Inventory;