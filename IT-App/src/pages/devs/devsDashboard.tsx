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







import { BiFontSize, BiSave } from "react-icons/bi";

import CryptoJS from "crypto-js";

import * as XLSX from 'xlsx';


const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");

const dark = localStorage.getItem("theme") || "";

const DevsDashboard: FC = function () {

  const [data, setData] = useState([] as any[]);

  const [sharedState, setSharedState] = useState(false);


  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/dev')
      .then(res => setData(res.data))
  }, [sharedState])



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


    </NavbarSidebarLayout2>
  );
};


const CurrentTasksView: FC<any> = function ({ sharedState }: any) {
  const [data, setData] = useState<[MyDictionary, MyDictionary2[]] | null>(null);


  //Definiendo la interface:
  interface DataGraphis {
    header: string[];
    rows: { [key: string]: string | number }[];
  }
  const [dataGraphis, setDataGraphis] = useState<DataGraphis>({ header: [], rows: [] });


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

  // useEffect(() => {
  //   axios.get('https://bn.glassmountainbpo.com:8080/dev/dashboard')
  //     .then(res => setData(res.data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, [sharedState])



  useEffect(() => {
    axios.get('https://bn.glassmountainbpo.com:8080/inventory/stockSummary')
      .then(res => setDataGraphis(res.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [sharedState])

  const [valores, setValores]: number | any = useState([]);
  const [labels, setLabels]: number | any = useState([]);


  //Dashboard Charts 2

  const [dataFilter, setDataFilter] = useState('' as any);
  const [consolidado, setFilterConsolidado] = useState([] as any[]);
  const [check, setCheck] = useState('');

  useEffect(() => {
    const filteredData = dataGraphis.rows.filter((row) => row['asset'] === dataFilter);
    setFilterConsolidado(filteredData);
    getChartOptions();
  }, [dataFilter, dataGraphis.rows]);

  const dark = localStorage.getItem("theme") || "";
  const [isDarkMode, setIsDarkMode] = useState(dark); // Suponiendo que tienes un estado para el modo oscuro




  useEffect(() => {


    const chartElement = document.getElementById("donut-chart");
  
    const chart = new ApexCharts(chartElement, getChartOptions());
    chart.render();

    const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');
    const handleCheckboxChange = (event: Event) => {
      const checkbox = event.target as HTMLInputElement;

      // Deselect all checkboxes except the one that was clicked
      checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
          (cb as HTMLInputElement).checked = false;
        }
      });

      const filterValue = checkbox.checked ? checkbox.value : '';
      setDataFilter(filterValue);

      const item = consolidado[0];

      const keysArray = Object.keys(item).filter(key => key !== 'total' && key !== 'total_qty');
      const numbersArray = keysArray.map(key => {
        const value = item[key];
        return typeof value === 'string' && !isNaN(value as any) ? Number(value) : value;
      }).filter(value => typeof value === 'number');

      setValores(numbersArray);
      setLabels(keysArray);
      chart.updateSeries(numbersArray);
      chart.updateOptions({ labels: keysArray });
      getChartOptions();

      setCheck('true');

    };
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', handleCheckboxChange);

    });

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('change', handleCheckboxChange);
      });
      chart.destroy();
    };
  }, [consolidado, check]);


  const getChartOptions = () => {
    return {
      series: valores,
      colors: [
        "#1E90FF",  // Azul fuerte
        "#32CD32",  // Verde lima
        "#8A2BE2",  // Azul violeta
        "#20B2AA",  // Verde azulado claro
        "#4B0082",  // Índigo
        "#4682B4",  // Azul acero
        "#6A5ACD",  // Azul pizarra medio
        "#008B8B",  // Cian oscuro
        "#0000CD",  // Azul medio
        "#2E8B57"   // Verde marino
      ],
      chart: {
        height: 420,
        width: "100%",
        type: "donut",
        fontSize: '128px'
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
                fontSize: "70%",
                color: '#FFFFFF' // Establece el color del texto a blanco
              },
              total: {
                showAlways: true,
                show: true,
                label: "Qty",
                fontFamily: "Inter, sans-serif",
                formatter: function (w: { globals: { seriesTotals: any[]; }; }) {
                  const sum = w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
                  return '' + sum + ''
                },
                color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
                fontSize: '18px'
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value: string) {
                  return value + ""
                },
                
                color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo

                fontSize: '52px'
              },
            },
            size: "70%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: labels,
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#FFFFFF'], // Establece el color del texto a blanco
        }
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
        fontSize: '18px'
      },
      yaxis: {
        labels: {
          formatter: function (value: string) {
            return value + ""
          },
          style: {
            color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
          }
        },
      },
      xaxis: {
        labels: {
          formatter: function (value: string) {
            return value + ""
          },
          style: {
            color: '#FFFFFF', // Establece el color del texto a blanco
          }
        },
        axisTicks: {
          show: true,
          color: '#737373',
        },
        axisBorder: {
          show: true,
          color: '#FFFFFF',
        },
      },
    }
  }
  


  const optionsVal = {
    // enable and customize data labels using the following example, learn more from here: https://apexcharts.com/docs/datalabels/
    dataLabels: {
      enabled: true,
      // offsetX: 10,
      style: {
        cssClass: 'text-xs text-white font-medium'
      },
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 16,
        right: 16,
        top: -26
      },
    },
    series: [
      {
        name: "Developer Edition",
        data: [150, 141, 145, 152, 135, 125],
        color: "#1A56DB",
      },
      {
        name: "Developer Delivery",
        data: [160, 131, 146, 182, 165, 45],
        color: "#9A66DB",
      },
      {
        name: "Designer Edition",
        data: [64, 41, 76, 41, 113, 173],
        color: "#7E3BF2",
      },
    ],
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    legend: {
      show: true
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    stroke: {
      width: 6,
    },
    xaxis: {
      categories: ['01 de febrero', '02 de febrero', '03 de febrero', '04 de febrero', '05 de febrero', '06 de febrero', '07 de febrero'],
      labels: {
        show: false,
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
      labels: {
        formatter: function (value: string) {
          return '$' + value;
        }
      }
    },
  }

  if (document.getElementById("data-labels-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("data-labels-chart"), optionsVal);
    chart.render();
  }


  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 mb-5 sm:p-6 xl:p-8">


      <div className="grid grid-cols-2 gap-4 pt-2 mb-8 ">


        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">

          <div id="column-chart-2">



            <div className="flex justify-between mb-3">
              <div className="flex justify-center items-center">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Assets</h5>
                <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
                </svg>
                <div data-popover id="chart-info" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
                    <p>Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend, as stagnating chart signifies a significant decrease of community activity.</p>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Calculation</h3>
                    <p>For each date bucket, the all-time volume of activities is calculated. This means that activities in period n contain all activities up to period n, plus the activities generated by your community in period.</p>
                    <a href="#" className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline">Read more <svg className="w-2 h-2 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg></a>
                  </div>
                  <div data-popper-arrow></div>
                </div>
              </div>
              <div>
                <button type="button" data-tooltip-target="data-tooltip" data-tooltip-placement="bottom" className="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm"><svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                </svg><span className="sr-only">Download data</span>
                </button>
                <div id="data-tooltip" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                  Download CSV
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </div>
            </div>




            <div className="max-w-auto w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
              <div className="flex justify-between dark:border-gray-700 pb-3">
                <dl>

                </dl>
                <div>
                  <div className="relative">
                    <div className="flex flex-wrap" id="devices">


                      <>

                        {dataGraphis.rows.map((row, rowIndex) => (
                          <div key={rowIndex} className="">
                            <input
                              id={(row as any)['asset']}
                              type="checkbox"
                              value={(row as any)['asset']}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor={(row as any)['asset']}
                              className="mr-2 ms-1  text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              <span key={rowIndex}>
                                {(row as any)['asset']}
                              </span>
                            </label>
                          </div>
                        ))}

                      </>


                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div>


            </div>


            <div className="py-6" id="donut-chart"></div>

            <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
              <div className="flex justify-between items-center pt-5">

                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="lastDaysdropdown"
                  data-dropdown-placement="bottom"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                  type="button">

                  <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div id="lastDaysdropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
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
                  Traffic analysis
                  <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                  </svg>
                </a>
              </div>
            </div>



          </div>

        </div>



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
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Inventory total</p>
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
                  <div className="flex" id="devices">
                    <div className="flex items-center me-4">
                      <input id="desktop" type="checkbox" value="desktop" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="desktop" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Desktop</label>
                    </div>
                    <div className="flex items-center me-4">
                      <input id="tablet" type="checkbox" value="tablet" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="tablet" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Tablet</label>
                    </div>
                    <div className="flex items-center me-4">
                      <input id="mobile" type="checkbox" value="mobile" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="mobile" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mobile</label>
                    </div>
                  </div>
                </dl>
                <dl className="flex items-center justify-end">
                  <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1"> Percentage per account:</dt>
                  <dd className="text-gray-900 text-sm dark:text-white font-semibold">1.2%</dd>
                </dl>
              </div>

              <div id="data-labels-chart"></div>
              <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div className="flex justify-between items-center pt-5">

                  <button
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="lastDaysdropdown"
                    data-dropdown-placement="bottom"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                    type="button">

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


      <div className="grid grid-cols-1 gap-4 pt-2 mb-8 ">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
          <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" hoverable>
            <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

              {/* {dataGraphis.header.map((headerItem, index) => (
                <th key={index} scope="col" className="py-3 px-6">
                  {headerItem}
                </th>
              ))} */}

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
      </div>

    </div >

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
    <div >

    </div>
  );
};


export default DevsDashboard;