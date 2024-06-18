/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Table,
  Badge,
} from "flowbite-react";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react"
import {
  HiOutlineZoomIn ,
} from "react-icons/hi";

import NavbarSidebarLayout2 from "../../layouts/navbar-sidebar2";
import axios from "axios";

import ApexCharts from 'apexcharts'; // Importación del módulo ApexCharts
import CryptoJS from "crypto-js";


const created_user3 = localStorage.getItem("badgeSession") || "";
const created_user2 = (created_user3 ? CryptoJS.AES.decrypt(created_user3, "Tyrannosaurus") : "");
const created_user = (created_user2 ? created_user2.toString(CryptoJS.enc.Utf8) : "");


const DevsDashboard: FC = function () {

  const [sharedState] = useState(false);
  return (
    <NavbarSidebarLayout2 isFooter={true}>
      <CurrentTasksView
        sharedState={sharedState} />
    </NavbarSidebarLayout2>
  );
};

console.log('%&*CreatedUser', created_user)


const CurrentTasksView: FC<any> = function ({ sharedState }: any) {


  //Definiendo la interface:
  interface DataGraphis {
    header: string[];
    rows: { [key: string]: string | number }[];
  }

  interface totalSummary {
    total: string;
  }





  const [dataGraphis, setDataGraphis] = useState<DataGraphis>({ header: [], rows: [] });

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


  const [valores, setValores] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [consolidado, setFilterConsolidado] = useState<any[]>([]);
  const [check, setCheck] = useState<string>('');

  const [chartData, setChartData] = useState<any[]>([]); // Aquí mantén el estado del gráfico
  const [filtro, setFiltro] = useState<string>('');


  const dark = localStorage.getItem("theme") || "";

  console.log('consolidado%%Check?', setFilterConsolidado, consolidado, check)


  const handleCheckboxChange2 = async (event: ChangeEvent<HTMLInputElement>) => {
    const checkbox = event.target;

    // Deselect all checkboxes except the one that was clicked
    const filterValue = checkbox.checked ? checkbox.value : '';
    setFiltro(filterValue);

    // Realiza otras acciones necesarias con filterValue si es necesario
  };


  useEffect(() => {

    const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');
    const handleCheckboxChange = async (event: Event) => {
      const checkbox = event.target as HTMLInputElement;

      // Deselect all checkboxes except the one that was clicked
      checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
          (cb as HTMLInputElement).checked = false;
        }
      });

      const filterValue = checkbox.checked ? checkbox.value : '';

      const filteredData = dataGraphis.rows.filter((row) => row['asset'] === filterValue);

      setFiltro(filterValue)

      const item: any = filteredData[0];


      if (item) {
        const keysArray = Object.keys(item).filter(key => key !== 'total' && key !== 'total_qty');
        const numbersArray = keysArray.map(key => {
          const value = item[key];
          return typeof value === 'string' && !isNaN(value as any) ? Number(value) : value;
        }).filter(value => typeof value === 'number');

        setValores(numbersArray);
        setLabels(keysArray);

        setCheck('true');
        setChartData(["true"])
      }
    };

    checkboxes.forEach((checkbox) => {
      setFiltro('true')
      checkbox.addEventListener('change', handleCheckboxChange);
    });

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('change', handleCheckboxChange);
      });
      // chart.destroy();
    };
  }, [filtro]);



  const getChartOptions2 = () => {
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
                color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
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
          color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
        }
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        // cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
        color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
        fontSize: '14px'
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
            color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
            // cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        },
        axisTicks: {
          show: true,
          // color: '#737373',
          color: dark === 'dark' ? '#737373' : '#000000', // Cambia el color según el modo
        },
        axisBorder: {
          show: true,
          // color: '#FFFFFF',
          color: dark === 'dark' ? '#FFFFFF' : '#000000', // Cambia el color según el modo
        },
      },
    }
  }


  // const optionsVal = {
  //   // enable and customize data labels using the following example, learn more from here: https://apexcharts.com/docs/datalabels/
  //   dataLabels: {
  //     enabled: true,
  //     // offsetX: 10,
  //     style: {
  //       cssClass: 'text-xs text-white font-medium'
  //     },
  //   },
  //   grid: {
  //     show: false,
  //     strokeDashArray: 4,
  //     padding: {
  //       left: 16,
  //       right: 16,
  //       top: 16
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Count",
  //       data: valores,
  //       color: "#1A56DB",
  //     },

  //   ],
  //   chart: {
  //     height: "150%",
  //     maxWidth: "100%",
  //     type: "area",
  //     fontFamily: "Inter, sans-serif",
  //     dropShadow: {
  //       enabled: false,
  //     },
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   tooltip: {
  //     enabled: true,
  //     x: {
  //       show: false,
  //     },
  //   },
  //   legend: {
  //     show: true
  //   },
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       opacityFrom: 0.55,
  //       opacityTo: 0,
  //       shade: "#1C64F2",
  //       gradientToColors: ["#1C64F2"],
  //     },
  //   },
  //   stroke: {
  //     width: 6,
  //   },
  //   xaxis: {
  //     categories: labels,
  //     labels: {
  //       show: true,
  //     },
  //     axisBorder: {
  //       show: false,
  //     },
  //     axisTicks: {
  //       show: true,
  //     },
  //   },
  //   yaxis: {
  //     show: true,
  //     labels: {
  //       formatter: function (value: string) {
  //         return value;
  //       }
  //     }
  //   },
  // }


  const optionsVal = {
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
    series: [
      {
        name: "Qty",
        color: "#1A56DB",
        data: valores,
      },

    ],
    chart: {
      type: "bar",
      height: "520px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
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
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 70
      },
    },
    dataLabels: {
      enabled: true,
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
        show: true,
      },
      axisTicks: {
        show: true,
      },
      categories: labels,
    },
    yaxis: {
      show: true,
    },
    fill: {
      opacity: 10,
    },
  }



  useEffect(() => {
    const chart2 = new ApexCharts(document.querySelector("#donut-chart"), getChartOptions2());
    chart2.render();

    const chart3 = new ApexCharts(document.querySelector("#column-chart"), optionsVal);
    chart3.render();

    // Retornar una función de limpieza para destruir el gráfico al desmontar el componente o al actualizar chartData
    return () => {
      chart2.destroy();
      chart3.destroy();
    };
  }, [chartData]);


  const [isReady, setIsReady] = useState(false);

  useEffect(() => {


    const handleReadyStateChange = () => {
      setIsReady(true)
      if (document.readyState === 'complete') {
        console.log('listo');
        setFiltro('Computers');
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
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 mb-5 sm:p-6 xl:p-8">


      <div className="grid grid-cols-2 gap-4 pt-2 mb-8 ">


        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">

          <div id="column-chart-2">
            <div className="max-w-auto w-full bg-white rounded-lg shadow dark:bg-gray-800 p- md:p-2">

              <div className="relative">
                <div className="flex flex-wrap" id="devices">
                  <Badge color={'indigo'}>
                    <h1 className="text-sm ml-2 mr-2 font-medium text-gray-900 dark:text-black-100">filters: </h1>
                  </Badge>
                  <>
                    {dataGraphis.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="ml-2">
                        <input
                          id={(row as any)['asset']}
                          type="checkbox"
                          value={(row as any)['asset']}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={handleCheckboxChange2}
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
          <div>

            <div className="py-6 pt-32" id="donut-chart"></div>

            <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
              <div className="flex justify-between items-center p">

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
                    <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">{totalSummary}
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Inventory total</p>
                  </div>
                </div>
                <div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13V1m0 0L1 5m4-4 4 4" />
                    </svg>

                  </span>
                </div>
              </div>
              <div id="column-chart"></div>

              <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div className="flex justify-between items-center pt-5">

                  <a
                    href="/Reports"
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
              {['asset', 'total_qty', ...dataGraphis.header.filter(header => header !== 'total_qty' && header !== 'asset' && header !== 'total')].map((headerItem, index) => (
                <th key={index} scope="col" className="py-3 px-6">
                  {headerItem}
                </th>
              ))}
            </Table.Head>
            <Table.Body>
              {dataGraphis.rows.map((row, rowIndex) => (
                <Table.Row key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {['asset', 'total_qty', ...dataGraphis.header.filter(header => header !== 'total_qty' && header !== 'asset' && header !== 'total')].map((headerItem, colIndex) => (
                    <Table.Cell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">

                      {headerItem === 'asset' ? (

                        <a
                          className="bg-white-700 h-4 pt-0 dark:bg-transparency-800 dark:hover:bg-indigo-500 items-center font-semibold rounded-full"
                          href={`/Inventory?filter=${(row as any)[headerItem]}`}>
                          <div className="flex bg-white-700 h-4 pt-0 dark:bg-transparency-800 dark:hover:bg-indigo-500 items-center font-semibold rounded-full">
                            <span className="flex items-left text-gray-500 font-semibold mr-4 rounded dark:text-white ">
                              <HiOutlineZoomIn  className=" text-2xl" />  {/* Añade margen derecho para separar el ícono del texto */}
                            </span>
                            <span className="flex items-left 0 font-semibold mr-4 rounded dark:text-white dark:font-medium">
                            {(row as any)[headerItem]}
                             
                            </span>

                          </div>
                        </a>

                      ) : headerItem === 'total_qty' ? (
                        // <h1 className="text-indigo-700 bg-indgo  item-center">{(row as any)[headerItem]}</h1>
                        <h1 className="text-white bg-green-500 item-center py-1 px-8 rounded-full dark:bg-primary-100 dark:font-semibold dark:text-gray-600 ">{(row as any)[headerItem]}</h1>

                      ) : (
                        // (row as any)[headerItem]
                        <h1 className="text-gray-900 bg-primary-50 item-center py-1 px-8 rounded-full dark:bg-gray-800 dark:text-white dark:font-medium ">{(row as any)[headerItem]}</h1>
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




export default DevsDashboard;