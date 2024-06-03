/* eslint-disable jsx-a11y/anchor-is-valid */
import { Label, Table, TextInput, Dropdown, Checkbox as FlowbiteCheckbox } from "flowbite-react";
import React, { SetStateAction, useState, useEffect, type FC } from "react";
import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import { InventoryItem, DetailItem } from "../../types";
import { HiRefresh } from "react-icons/hi";
import axios from "axios";

const Inventory: FC = function () {
  const [grandTotalData, setGrandTotalData] = useState<{ [key: string]: InventoryItem[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
          acc[item.asset].push(item);
          return acc;
        }, {});
        setGrandTotalData(organizedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
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
            {/* <div className="ml-auto mr-4 flex items-center space-x-2 sm:space-x-3">
                  <AddTaskModal
                    sharedState={sharedState}
                    updateSharedState={updateSharedState} />
                  <ExportModal
                    data={data} />
                </div> */}
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
                            {grandTotalData[asset].reduce((total, item) => total + item.quantity, 0)}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          <span className="bg-yellow-600 text-yellow-200 font-semibold px-2 py-0.5 rounded dark:bg-yellow-400 dark:text-yellow-900">
                            {grandTotalData[asset].reduce((total, item) => total + parseFloat(item.totalPrice), 0).toFixed(2)}
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
                <td colSpan={4} className="py-2 px-4 border-b">
                  <div className="bg-gray-100 p-4">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                      <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Brand</th>
                            <th className="py-2 px-4 border-b">Model</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Total Price</th>
                            <th className="py-2 px-4 border-b">Details</th>
                          </tr>
                      </thead>
                      <tbody>
                          {grandTotalData[asset].map((detail) => (
                            <tr key={detail.id}>
                              <td className="py-2 px-4 border-b">{detail.id}</td>
                              <td className="py-2 px-4 border-b">{detail.brand}</td>
                              <td className="py-2 px-4 border-b">{detail.model}</td>
                              <td className="py-2 px-4 border-b">{detail.quantity}</td>
                              <td className="py-2 px-4 border-b">{detail.totalPrice}</td>
                              <td className="py-2 px-4 border-b">{detail.details}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
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


export default Inventory;