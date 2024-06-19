/* eslint-disable jsx-a11y/anchor-is-valid */
import {
       Table,
    Badge

} from "flowbite-react";
import type { FC, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal } from "react";
import { useEffect, useState } from "react";

import { HiTable } from "react-icons/hi";


import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import axios from "axios";
import { Accordion } from "flowbite-react";


import CryptoJS from "crypto-js";
import { utils, writeFile } from 'xlsx-js-style';



const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");


const AllReports: FC = function () {

    const [sharedState, setSharedState] = useState(false);


    console.log('$%^CreateUser', created_user, setSharedState)
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
    const [data_perClient, setData_perClient]: any = useState([]);
    const [days, setDays]: any = useState([]);

    const [dataw, setDataw]: any = useState([]);
    const [daysw, setDaysw]: any = useState([]);


    // var para filtrar solamente por dia 
    const today = new Date();
    const currentDay = today.getDate();
    // const currentMonth = today.getMonth() + 1; // Los meses en JS van de 0 a 11
    // const currentYear = today.getFullYear();


    const [activeLink, setActiveLink] = useState('');


    useEffect(() => {

    }, [activeLink]);

    const handleSetActiveLink = (link: any) => {
        setActiveLink((prevLink) => (prevLink === link ? '' : link));
    };

    console.log(activeLink)

    //filtrando datos para los reportes

    console.log('Preparando los reportes', data);
    console.log('Preparando los reportesLIMTADOS ', data_perClient);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [graphisRes, totalRes, report, reporClient, reportW] = await Promise.all([
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/stockSummary'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/total_summmary'),
                    // axios.get('https://bn.glassmountainbpo.com:8080/inventory/monthly_report'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/monthly_report_new'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/report_per_client'),
                    axios.get('https://bn.glassmountainbpo.com:8080/inventory/monthly_one')
                ]);

                setDataGraphis(graphisRes.data);
                setDataTotal(totalRes.data);
                setData(report.data);
                setData_perClient(reporClient.data);
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
                .filter(key => !['asset', 'brand', 'category', 'vendor', 'total'].includes(key));

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




    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const exportToGraphis = () => {
        // Supongamos que dataGraphis está disponible y tiene la estructura adecuada
        const originalHeaders = ['asset', 'total_qty', ...dataGraphis.header.filter(header => header !== 'total_qty' && header !== 'asset')];

        // Convertir todos los encabezados a mayúsculas y agregar la nueva columna para la fecha del reporte
        const headers = [...originalHeaders.map(header => header.toUpperCase()), 'DATE_REPORT']; // Fecha al final

        const rows = dataGraphis.rows;

        // Obtener la fecha actual
        const currentDate = getCurrentDate();

        // Convertir los datos a un formato adecuado para xlsx, incluyendo la nueva columna de fecha
        const formattedData = rows.map(row => {
            let formattedRow: any = {
                'DATE_REPORT': currentDate // Nueva columna con la fecha actual
            };
            originalHeaders.forEach((header) => {
                formattedRow[header.toUpperCase()] = row[header]; // Usar los nombres de los encabezados originales en mayúsculas como claves
            });
            return formattedRow;
        });

        // Crear la hoja de cálculo
        const ws = utils.json_to_sheet(formattedData, { header: headers });

        // Aplicar estilos a los encabezados
        headers.forEach((_header, index) => {
            const cellAddress = utils.encode_cell({ r: 0, c: index }); // Celda en la primera fila (0) y columna correspondiente (index)
            if (!ws[cellAddress]) ws[cellAddress] = {}; // Asegúrate de que la celda existe
            ws[cellAddress].s = {
                fill: {
                    fgColor: { rgb: "000000" } // Fondo negro
                },
                font: {
                    color: { rgb: "FFFFFF" }, // Texto blanco
                    bold: true // Texto en negrita para mayor claridad
                },
                alignment: {
                    horizontal: 'center', // Alineación horizontal
                    vertical: 'center' // Alineación vertical
                }
            };
        });

        // Ajustar el tamaño de las columnas al contenido
        const columnWidths = headers.map(header => ({ wch: header.length + 5 })); // Ajusta según sea necesario
        ws['!cols'] = columnWidths;

        // Crear el libro de trabajo
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');

        // Guardar el archivo Excel
        writeFile(wb, 'dataGraphis_export.xlsx');
    };







    const exportToExcel = () => {
        // Obtener la fecha actual
        const currentDate = getCurrentDate();
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.toLocaleString('default', { month: 'long' });

        // Definir el orden deseado para las columnas
        const fixedFields = ['asset', 'brand', 'category', 'total'];
        const dayFields = Object.keys(data[0]).filter(key => key.match(/^\d{2}June$/));
        const additionalFields = ['vendor'];
        const newField = ['Report_date'];

        // Combinar todos los campos en el orden deseado
        const headers = [...fixedFields, ...dayFields, ...additionalFields, ...newField];

        // Reorganizar los datos según el nuevo orden de los campos
        const formattedData = data.map((row: { [x: string]: any; }) => {
            let formattedRow: any = {};
            headers.forEach(header => {
                if (header === 'Report_date') {
                    formattedRow[header] = currentDate; // Añadir la fecha actual
                } else if (dayFields.includes(header)) {
                    const dayNumber = parseInt(header, 10);
                    if (dayNumber > currentDay && currentMonth === "June") {
                        formattedRow[header] = ''; // Dejar en blanco si es una fecha futura
                    } else {
                        formattedRow[header] = row[header]; // Copiar el valor del campo correspondiente
                    }
                } else {
                    formattedRow[header] = row[header]; // Copiar el valor del campo correspondiente
                }
            });
            return formattedRow;
        });

        // Crear la hoja de cálculo
        const wsAgents = utils.json_to_sheet(formattedData, { header: headers });

        // Aplicar estilos a los encabezados
        headers.forEach((_header, index) => {
            const cellAddress = utils.encode_cell({ r: 0, c: index }); // Celda en la primera fila (0) y columna correspondiente (index)
            if (!wsAgents[cellAddress]) wsAgents[cellAddress] = {}; // Asegúrate de que la celda existe
            wsAgents[cellAddress].s = {
                fill: {
                    fgColor: { rgb: "000000" } // Fondo negro
                },
                font: {
                    color: { rgb: "FFFFFF" }, // Texto blanco
                    bold: true // Texto en negrita para mayor claridad
                },
                alignment: {
                    horizontal: 'center', // Alineación horizontal
                    vertical: 'center' // Alineación vertical
                }
            };
        });

        // Ajustar el tamaño de las columnas al contenido
        const columnWidths = headers.map(header => ({ wch: header.length + 5 })); // Ajusta según sea necesario
        wsAgents['!cols'] = columnWidths;

        // Crear un libro de trabajo
        const wb = utils.book_new();
        utils.book_append_sheet(wb, wsAgents, 'Report');

        // Guardar el archivo Excel
        writeFile(wb, 'exported_data.xlsx');
    };


    const exportToExcelSegment = () => {
        // Obtener la fecha actual
        const currentDate: string = getCurrentDate();
        const currentDateObj: Date = new Date();
        const currentDay: number = currentDateObj.getDate();
        const currentMonth: string = currentDateObj.toLocaleString('default', { month: 'long' });

        // Definir el orden deseado para las columnas
        const fixedFields: string[] = ['groups', 'total'];

        // Obtener todos los días del mes
        const dayFields: string[] = Object.keys(data_perClient[0]).filter(key => key.match(new RegExp(`^\\d{2}${currentMonth}$`)));

        const additionalFields: string[] = [];
        const newField: string[] = ['Report_date'];

        // Combinar todos los campos en el orden deseado
        const headers: string[] = [...fixedFields, ...dayFields, ...additionalFields, ...newField];

        const groupedData: { [key: string]: any } = {};
        const agentsData: any[] = [];

        // Agrupar datos por "asset"
        data_perClient.forEach((row: { [key: string]: any }) => {
            if (row["asset"] === "Agents") {
                // Mantener las filas de "Agents" tal como están
                agentsData.push(row);
            } else {
                if (!groupedData[row["asset"]]) {
                    groupedData[row["asset"]] = {
                        groups: row["asset"],
                        total: 0,
                        Report_date: currentDate
                    };
                }

                groupedData[row["asset"]].total += parseFloat(row["total"]);
                dayFields.forEach(day => {
                    if (!groupedData[row["asset"]][day]) {
                        groupedData[row["asset"]][day] = 0;
                    }
                    if (parseInt(day.slice(0, 2)) <= currentDay) {
                        groupedData[row["asset"]][day] += parseFloat(row[day] || 0);
                    }
                });
            }
        });

        const formattedData: any[] = Object.values(groupedData).map((asset: any) => {
            let formattedRow: { [key: string]: any } = {};
            headers.forEach((header: string) => {
                if (header === 'Report_date') {
                    formattedRow[header] = currentDate; // Añadir la fecha actual
                } else if (dayFields.includes(header) && parseInt(header.slice(0, 2)) > currentDay) {
                    formattedRow[header] = ""; // Dejar en blanco los días después de la fecha actual
                } else {
                    formattedRow[header] = asset[header] !== undefined ? asset[header] : ""; // Copiar el valor del campo correspondiente o dejar en blanco
                }
            });
            return formattedRow;
        });

        // Agregar los datos de "Agents" al principio del formattedData
        agentsData.forEach((agentRow: { [key: string]: any }) => {
            let formattedRow: { [key: string]: any } = {};
            headers.forEach((header: string) => {
                if (header === 'Report_date') {
                    formattedRow[header] = currentDate; // Añadir la fecha actual
                } else if (header === 'groups') {
                    formattedRow[header] = agentRow["asset"] + ' ' + agentRow["category"]; // Asegurarse de que "groups" tenga el valor "asset + category" para Agents
                } else if (dayFields.includes(header) && parseInt(header.slice(0, 2)) > currentDay) {
                    formattedRow[header] = ""; // Dejar en blanco los días después de la fecha actual
                } else {
                    formattedRow[header] = agentRow[header] !== undefined ? agentRow[header] : ""; // Copiar el valor del campo correspondiente o dejar en blanco
                }
            });
            formattedData.unshift(formattedRow); // Insertar al principio
        });

        // Insertar una fila negra después de los datos de "Agents"
        if (agentsData.length > 0) {
            let separatorRow: { [key: string]: any } = {};
            headers.forEach(header => {
                separatorRow[header] = ""; // Dejar en blanco todas las celdas de la fila negra
            });
            formattedData.splice(agentsData.length, 0, separatorRow);
        }

        // Crear la hoja de cálculo
        const wsAgents = utils.json_to_sheet(formattedData, { header: headers });

        // Aplicar estilos a los encabezados
        headers.forEach((_header: string, index: number) => {
            const cellAddress = utils.encode_cell({ r: 0, c: index }); // Celda en la primera fila (0) y columna correspondiente (index)
            if (!wsAgents[cellAddress]) wsAgents[cellAddress] = {}; // Asegúrate de que la celda existe
            wsAgents[cellAddress].s = {
                fill: {
                    fgColor: { rgb: "000000" } // Fondo negro
                },
                font: {
                    color: { rgb: "FFFFFF" }, // Texto blanco
                    bold: true // Texto en negrita para mayor claridad
                },
                alignment: {
                    horizontal: 'center', // Alineación horizontal
                    vertical: 'center' // Alineación vertical
                }
            };
        });

        // Ajustar el tamaño de las columnas al contenido
        const columnWidths = headers.map((header: string) => ({ wch: header.length + 5 })); // Ajusta según sea necesario
        wsAgents['!cols'] = columnWidths;

        // Alinear el contenido de las filas a la izquierda
        for (let R = 1; R <= formattedData.length; R++) {
            for (let C = 0; C < headers.length; C++) {
                const cellAddress = utils.encode_cell({ r: R, c: C });
                if (wsAgents[cellAddress]) {
                    if (!wsAgents[cellAddress].s) wsAgents[cellAddress].s = {};
                    wsAgents[cellAddress].s.alignment = {
                        horizontal: 'left', // Alineación horizontal a la izquierda
                        vertical: 'center' // Alineación vertical al centro
                    };
                    // Aplicar el fondo negro a la fila separadora
                    if (R === agentsData.length + 1) {
                        wsAgents[cellAddress].s.fill = {
                            fgColor: { rgb: "424242" } // Fondo negro
                        };
                    }
                }
            }
        }

        // Crear un libro de trabajo
        const wb = utils.book_new();
        utils.book_append_sheet(wb, wsAgents, 'Report');

        // Guardar el archivo Excel
        writeFile(wb, 'HeadCount_per_Client_' + currentMonth + '_' + currentDate + '.xlsx');
    };



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


    return (


        <Accordion  className="mx-0">

            <Accordion.Panel>
                <Accordion.Title onClick={() => handleSetActiveLink('uno')}>
                    <table className="w-full">

                        <tr>
                            <td className="text-left">
                                <div className="flex justify-center items-center mb-2">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white  pe-1">General Report</h5>
                                    <h1 className=" leading-none text-gray-900 dark:text-white pe-1">by Category</h1>
                                </div>
                            </td>
                            <td className="text-right">
                                <button onClick={exportToGraphis} className="dark:bg-gray-800 dark:hover:bg-indigo-500 hover:bg-indigo-500 bg-indigo-700 text-white font-bold py-1 px-1 rounded-full  right-0 top-10">
                                    <HiTable className="h-7 w-7" />
                                </button>
                                {/* <Button onClick={exportToGraphis} className="mb-2 ml-2 bg-primary-500 text-gray-500  dark:bg-gray-800 dark:text-white dark:hover:text-white">
                                <HiTable />excel
                                </Button> */}
                            </td>
                        </tr>
                    </table>
                </Accordion.Title>
                <Accordion.Content hidden={activeLink !== 'uno'}>

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
                                                    // <Button className="bg-indigo-700 h-4 pt-0 dark:bg-indigo-800 dark:hover:bg-indigo-500">{(row as any)[headerItem]}</Button>
                                                    <a
                                                        className="bg-white text-gray-800 h-4 pt-0 dark:bg-gray-800 dark:text-white inline-block px-3 py-1 rounded"
                                                        href={`/Inventory?filter=${(row as any)[headerItem]}`}
                                                    >
                                                        {(row as any)[headerItem]}
                                                    </a>

                                                ) : (headerItem === 'total') ? <Badge></Badge> : (
                                                    // ) : (headerItem === 'total') ? <Badge>${(row as any)[headerItem]}</Badge> : (
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
                <Accordion.Title onClick={() => handleSetActiveLink('dos')}>
                    <table className="w-full">
                        <tr>
                            <td className="text-left">
                                <div className="flex justify-center items-center mb-2">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Report</h5>
                                    <h1 className=" leading-none text-gray-900 dark:text-white pe-1">Per Client</h1>
                                </div>
                            </td>
                            <td className="text-right">
                                {/* <Button onClick={exportToExcelSegment} className="mb-2 bg-primary-500 ml-2 text-gray-500  dark:bg-gray-800 dark:text-white dark:hover:text-white font-bold">
                                    <HiTable /> excel
                                </Button> */}

                                <button onClick={exportToExcelSegment} className="dark:bg-gray-800 dark:hover:bg-indigo-500 hover:bg-indigo-500 bg-indigo-700 text-white font-bold py-1 px-1 rounded-full  right-0 top-10">
                                    <HiTable className="h-7 w-7" />
                                </button>
                            </td>
                        </tr>
                    </table>


                </Accordion.Title>
                <Accordion.Content hidden={activeLink !== 'dos'}>

                    <div className="grid grid-cols-1 gap-4 pt-2 mb-8 ">
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                            <div>
                                <div className="flex justify-center items-center mb-4">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Agents</h5>
                                    <h1 className=" leading-none text-gray-900 dark:text-white pe-1"> Detail</h1>
                                </div>
                                <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>
                                    <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                        <th scope="col" className="py-3 px-6">Agents</th>
                                        <th scope="col" className="py-3 px-6">Brand</th>
                                        <th scope="col" className="py-3 px-6">Category</th>
                                        <th scope="col" className="py-3 px-6">Vendor</th>
                                        {days.map((day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | Key | null | undefined) => (
                                            <th >{day}</th>
                                        ))}
                                        <th scope="col" className="py-3 px-6">Total</th>
                                    </Table.Head>
                                    <Table.Body>
                                        
                                        {data.filter((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, _index: Key | null | undefined) => row.asset === "Agents").map((row: { [x: string]: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; asset: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; brand: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; category: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; vendor: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; }, index: Key | null | undefined) => (
                                            <Table.Row key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                <td scope="col" className="py-3 px-6">{row.brand}</td>
                                                <td scope="col" className="py-3 px-6 bg-gray-200 font-semibold dark:bg-gray-900 ">{row.category}</td>
                                                <td scope="col" className="py-3 px-6">{row.vendor}</td>
                                                {/* {days.map((day: Key | null | any) => (
                                                    <td key={day}>{row[day]}</td>
                                                ))} */}

                                                {days.map((day: Key | null | any) => {
                                                    const dayNumber = parseInt(day, 10); // Asumiendo que 'day' es una cadena representando el día
                                                    if (dayNumber > currentDay) {
                                                        return <td key={day}></td>;
                                                    } else {
                                                        return <td key={day}>{row[day]}</td>;
                                                    }
                                                })}
                                                <td scope="col" className="py-3 px-6"><Badge>{row["total"]}</Badge></td>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>


                                <div className="flex justify-center items-center mb-4 mt-8">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">IT INVENTORY</h5>
                                    <h1 className=" leading-none text-gray-900 dark:text-white pe-1"> DETAILS</h1>
                                </div>

                                <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>
                                    <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                        <th scope="col" className="py-3 px-6">ASSETS</th>
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
                                        {dataw
                                            .filter((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) =>
                                                typeof row.asset === 'string' && !row.asset.includes("Agents")
                                            )
                                            .map((row: any, index: any) => (
                                                <Table.Row key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                    {/* {daysw.map((day: Key | null | any) => (
                                                        <td key={day}>{row[day]}</td>
                                                    ))} */}
                                                    {daysw.map((day: Key | null | any) => {
                                                        const dayNumber = parseInt(day, 10); // Asumiendo que 'day' es una cadena representando el día
                                                        if (dayNumber > currentDay) {
                                                            return <td key={day}></td>;
                                                        } else {
                                                            return <td key={day}>{row[day]}</td>;
                                                        }
                                                    })}
                                                    <td scope="col" className="py-3 px-3">{row["STOCK"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["Repair"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["Damaged"]}</td>
                                                    <td scope="col" className="py-3 px-3">{row["DISMISSED"]}</td>
                                                    <td scope="col" className="py-3 px-3"><Badge>{row["total"]}</Badge></td>
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
                <Accordion.Title onClick={() => handleSetActiveLink('tres')}>
                    <table className="w-full">
                        <tr>
                            <td className="text-left">
                                <div className="flex justify-center items-center mb-2">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Category</h5>
                                    <h1 className=" leading-none text-gray-900 dark:text-white pe-1">Monthly Report</h1>
                                </div>
                            </td>
                            <td className="text-right">

                                <button onClick={exportToExcel} className="dark:bg-gray-800 dark:hover:bg-indigo-500 hover:bg-indigo-500 bg-indigo-700 text-white font-bold py-1 px-1 rounded-full  right-0 top-10">
                                    <HiTable className="h-7 w-7" />
                                </button>
                                {/* <Button onClick={exportToExcel} className="mb-2 ml-2 bg-primary-500 text-gray-500  dark:bg-gray-800 dark:text-white dark:hover:text-white">
                                    <HiTable className="text-xl" />excel
                                </Button> */}

                            </td>

                        </tr>
                    </table>


                </Accordion.Title>
                <Accordion.Content hidden={activeLink !== 'tres'}>
                    {/* <Accordion.Content> */}
                    <div className="grid grid-cols-1 gap-4 pt-2 mb-8 ">
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                            <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                                <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>

                                    <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                        <th scope="col" className="py-3 px-6">Asset</th>
                                        <th scope="col" className="py-3 px-6">Brand</th>
                                        <th scope="col" className="py-3 px-6">Category</th>
                                        <th scope="col" className="py-3 px-6">Vendor</th>
                                        {days.map((day: boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | Key | null | undefined) => (
                                            <th >{day}</th>
                                        ))}
                                        <th scope="col" className="py-3 px-6">TOTAL</th>


                                    </Table.Head>
                                    <Table.Body>


                                        <div className="flex justify-left items-center mb-4 mt-4 ml-8">
                                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">AGENTS</h5>
                                            <h1 className=" leading-none text-gray-900 dark:text-white pe-1">  DETAILS</h1>
                                        </div>
                                        {data.filter((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) => row.asset === "Agents").map((row: { [x: string]: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; asset: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; brand: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; category: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; vendor: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; }, index: Key | null | undefined) => (
                                            <Table.Row key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                <td scope="col" className="py-3 px-6">{row.brand}</td>
                                                <td scope="col" className="py-3 px-6 bg-gray-200 font-semibold dark:bg-gray-900 ">{row.category}</td>
                                                <td scope="col" className="py-3 px-6">{row.vendor}</td>

                                                {/* {days.map((day: Key | null | any) => (
                                                    <td key={day}>{row[day]}</td>
                                                ))} */}

                                                {days.map((day: Key | null | any) => {
                                                    const dayNumber = parseInt(day, 10); // Asumiendo que 'day' es una cadena representando el día
                                                    if (dayNumber > currentDay) {
                                                        return <td key={day}></td>;
                                                    } else {
                                                        return <td key={day}>{row[day]}</td>;
                                                    }
                                                })}
                                                <td scope="col" className="py-3 px-6"><Badge>{row["total"]}</Badge></td>
                                            </Table.Row>
                                        ))}

                                        <div className="flex justify-left  ml-8 items-center mb-4 mt-4 text-gray-900 border-full">


                                            <h5 className="text-xl font-bold leading-none text-white-900 dark:text-white pe-1 border-full">IT INVENTORY</h5>
                                            <h1 className=" leading-none text-white-900 dark:text-white pe-1">  DETAILS</h1>

                                        </div>


                                        {data.filter((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, _index: Key | null | undefined) => row.asset !== "Agents").map((row: { [x: string]: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; asset: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; brand: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; category: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; vendor: string | number | boolean | ReactFragment | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined; }, index: Key | null | undefined) => (
                                            <Table.Row key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                <td scope="col" className="py-3 px-6">{row.brand}</td>
                                                <td scope="col" className="py-3 px-6 bg-gray-200 font-semibold dark:bg-gray-900 ">{row.category}</td>
                                                <td scope="col" className="py-3 px-6">{row.vendor}</td>
                                                {/* {days.map((day: Key | null | any) => (
                                                    <td key={day}>{row[day]}</td>
                                                ))} */}
                                                {days.map((day: Key | null | any) => {
                                                    const dayNumber = parseInt(day, 10); // Asumiendo que 'day' es una cadena representando el día
                                                    if (dayNumber > currentDay) {
                                                        return <td key={day}></td>;
                                                    } else {
                                                        return <td key={day}>{row[day]}</td>;
                                                    }
                                                })}
                                                <td scope="col" className="py-3 px-6"><Badge>{row["total"]}</Badge></td>
                                            </Table.Row>
                                        ))}
                                        {/* {data.map((row: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; asset: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; brand: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; vendor: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                                            <Table.Row key={index}>
                                                <td scope="col" className="py-3 px-6">{row.asset}</td>
                                                <td scope="col" className="py-3 px-6">{row.brand}</td>
                                                <td scope="col" className="py-3 px-6">{row.category}</td>
                                                <td scope="col" className="py-3 px-6">{row.vendor}</td>
                                                {days.map((day: Key | null | any) => (
                                                    <td key={day}>{row[day]}</td>
                                                ))}
                                            </Table.Row>
                                        ))} */}
                                    </Table.Body>
                                </Table>
                            </div>

                        </div>
                    </div>

                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>




    );
};




export default AllReports;