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
import type { ChangeEvent, FC, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal } from "react";
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

import { BiFontSize, BiSave } from "react-icons/bi";
import { Accordion } from "flowbite-react";


import CryptoJS from "crypto-js";

import * as XLSX from 'xlsx';


const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");


const AllReports: FC = function () {

    const [sharedState, setSharedState] = useState(false);
    return (
        <NavbarSidebarLayout2 isFooter={true}>
            <Reports
                sharedState={sharedState} />
        </NavbarSidebarLayout2>
    );
};


const Reports: FC<any> = function ({ sharedState }: any) {


    //Definiendo la interface:
    interface DataGraphis {
        header: string[];
        rows: { [key: string]: string | number }[];
    }

    interface totalSummary {
        total: string;
    }


    const [dataGraphis, setDataGraphis] = useState<DataGraphis>({ header: [], rows: [] });
    // const [dataTotal, setDataTotal] = useState<totalSummary>({ total: '' });

    const [dataTotal, setDataTotal] = useState<totalSummary[]>([]);

    const [data, setData]: any = useState([]);
    const [days, setDays]: any = useState([]);

    const [dataw, setDataw]: any = useState([]);
    const [daysw, setDaysw]: any = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [graphisRes, totalRes, report, reportW] = await Promise.all([
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/stockSummary'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/total_summmary'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/monthly_report'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/monthly_one')
                ]);

                setDataGraphis(graphisRes.data);
                setDataTotal(totalRes.data);
                setData(report.data);
                setDataw(reportW.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [sharedState]);

    useEffect(() => {
        if (data.length) {
            const days = Object.keys(data[0])
                .filter(key => !['asset', 'brand', 'category', 'vendor'].includes(key))
                .map(key => parseInt(key, 10))
                .sort((a, b) => a - b)
                .map(day => day.toString().padStart(2, '0'));

            setDays(days);
        }
    }, [data]);


    useEffect(() => {
        if (dataw.length) {
            const days2 = Object.keys(dataw[0])
                .filter(key => !['asset', 'DISMISSED', 'Damaged', 'Repair', 'STOCK', 'total'].includes(key))
                .map(key => parseInt(key, 10))
                .sort((a, b) => a - b)
                .map(day => day.toString().padStart(2, '0'));

            setDaysw(days2);
        }
    }, [dataw]);

    console.log('estos son los dias, ', days)
    console.log('estos son los dias GENERALES, ', daysw)

    const totalSummary: string[] = dataTotal.map((item) => item.total);

    console.log("este es el dato que ocupo", dataTotal)


    console.log('esta es mi ruta', dataw);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {


        const handleReadyStateChange = () => {
            setIsReady(true)
            if (document.readyState === 'complete') {
                console.log('listo');
                setIsReady(true);
            }
        };
        document.addEventListener('readystatechange', handleReadyStateChange);


    }, []);

    useEffect(() => {
        if (isReady) {
            const checkboxes: any = document.querySelectorAll('#devices input[type="checkbox"]');
            if (checkboxes.length > 0) {
                console.log('listo');
                checkboxes[0].click();

            }
        }
    }, [sharedState]);


    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index: SetStateAction<null>) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(index);
        }
    };

    const collapseAll = () => {
        setExpandedIndex(null);
    };


    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 mb-5 sm:p-6 xl:p-8">
            <Accordion >
                <Accordion.Panel>
                    <Accordion.Title>Report for account</Accordion.Title>
                    <Accordion.Content>
                        <Button className="mb-2 text-gray-500 dark:text-gray-400">
                            Download file
                        </Button>
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                            <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>
                                <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                                    {['asset', 'total_qty', ...dataGraphis.header.filter(header => header !== 'total_qty' && header !== 'asset')].map((headerItem, index) => (
                                        <th key={index} scope="col" className="py-3 px-6">
                                            {headerItem}
                                        </th>
                                    ))}

                                </Table.Head>
                                <Table.Body>
                                    {dataGraphis.rows.map((row, rowIndex) => (
                                        <Table.Row key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            {['asset', 'total_qty', ...dataGraphis.header.filter(header => header !== 'total_qty' && header !== 'asset')].map((headerItem, colIndex) => (
                                                <Table.Cell key={colIndex} className="py-4 px-6 font-semibold">
                                                    {headerItem === 'asset' ? (
                                                        <Button className="bg-indigo-700 h-4 pt-0 dark:bg-indigo-800 dark:hover:bg-indigo-500">{(row as any)[headerItem]}</Button>
                                                    ) : (headerItem === 'total') ? <Badge>${(row as any)[headerItem]}</Badge> : (
                                                        (row as any)[headerItem]
                                                    )}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))}

                                </Table.Body>
                            </Table>
                        </div>

                    </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                    <Accordion.Title>Report for month</Accordion.Title>
                    <Accordion.Content>
                        <Button className="mb-2 text-gray-500 dark:text-gray-400">
                            Download file
                        </Button>
                        <div className="grid grid-cols-1 gap-4 pt-2 mb-8 ">
                            <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                                <div>
                                    <h1>Monthly Report</h1>
                                    <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>

                                        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                            <th scope="col" className="py-3 px-6">Asset</th>
                                            <th scope="col" className="py-3 px-6">Brand</th>
                                            <th scope="col" className="py-3 px-6">Category</th>
                                            <th scope="col" className="py-3 px-6">Vendor</th>
                                            {days.map((day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | Key | null | undefined) => (
                                                <th >{day}</th>
                                            ))}


                                        </Table.Head>
                                        <Table.Body>
                                            {data.map((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                                                <Table.Row key={index}>
                                                    <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                    <td scope="col" className="py-3 px-6">{row.brand}</td>
                                                    <td scope="col" className="py-3 px-6">{row.category}</td>
                                                    <td scope="col" className="py-3 px-6">{row.vendor}</td>
                                                    {days.map((day: Key | null | any) => (
                                                        <td key={day}>{row[day]}</td>
                                                    ))}
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>

                            </div>
                        </div>

                    </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                    <Accordion.Title>Report for month (General)</Accordion.Title>
                    <Accordion.Content>
                        <Button className="mb-2 text-gray-500 dark:text-gray-400">
                            Download file
                        </Button>
                        <div className="grid grid-cols-1 gap-4 pt-2 mb-8 ">
                            <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                                <div>
                                    <h1>Monthly Report</h1>
                                    <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>

                                        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                            <th scope="col" className="py-3 px-6">Asset</th>


                                            {daysw.map((day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | Key | null | undefined) => (
                                                <th >{day}</th>
                                            ))}
                                            <th scope="col" className="py-2 px-3">STOCK</th>
                                            <th scope="col" className="py-2 px-3">REPAIR</th>
                                            <th scope="col" className="py-2 px-3">DAMAGED</th>
                                            <th scope="col" className="py-2 px-3">DISMISSED</th>
                                            <th scope="col" className="py-2 px-3">TOTAL</th>

                                        </Table.Head>
                                        <Table.Body>
                                            {dataw.map((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                                                <Table.Row key={index}>
                                                    <td scope="col" className="py-3 px-6">{row.asset}</td>

                                                    {daysw.map((day: Key | null | any) => (
                                                        <td key={day}>{row[day]}</td>
                                                    ))}
                                                    <td scope="col" className="py-3 px-3">{row["STOCK"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["Repair"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["Damaged"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["DISMISSED"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["total"]}</td>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>

                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>


        </div >

    );
};




export default AllReports;