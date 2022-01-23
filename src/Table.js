import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import matchSorter from "match-sorter";
import Filter from "./Filters";
import NumberRangeColumnFilter from "./components/NumberRangeColumnFilter";
import DefaultColumnFilter from "./components/DefaultColumnFilter";
import FilterComponent from "./Filters";

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table() {
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [groupby, setGroupby] = useState("day");
  const [from, setFrom] = useState("2020-01-10");
  const [to, setTo] = useState("2020-12-31");
  const columns = useMemo(
    () => [
      {
        Header: "Channelid",
        accessor: "channelid", // accessor is the "key" in the data
        filter: "fuzzyText",
      },

      {
        Header: "Amount",
        accessor: "amount",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Views",
        accessor: "views",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: () => (
          <div>
            <span className="text-center">Date </span>

            <Filter
              getGroupBy={(e) => setGroupby(e)}
              getTo={(e) => setTo(e)}
              getFrom={(e) => setFrom(e)}
            />
          </div>
        ),
        id: "col13",
        disableFilters: true,

        accessor: (a) =>
          a.viewdate
            ? a.viewdate
            : a["WEEK(viewdate)"]
            ? a["WEEK(viewdate)"] + "/" + a["YEAR(viewdate)"]
            : a["MONTH(viewdate)"]
            ? a["MONTH(viewdate)"] + "/" + a["YEAR(viewdate)"]
            : "",
      },
    ],
    []
  );

  useEffect(() => {
    axios
      .get("https://demo.clickmedia.gr/getdata.php", {
        params: {
          from: from,
          to: to,
          groupby: groupby,
          _limit: 200,
        },
      })
      .then((response) => {
        // check if the data is populated
        console.log(response.data);
        setData(response.data);
        // you tell it that you had the result
        setLoadingData(false);
      });
  }, [from, to, groupby, loadingData]);

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    previousPage,
    canPreviousPage,
    nextPage,
    visibleColumns,
    canNextPage,
    page,
  } = useTable(
    {
      columns,

      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },

    useFilters,
    useSortBy,
    usePagination // useFilters!
    // useGlobalFilter!
  );

  return (
    <div className="">
      {/* <Filter
        getGroupBy={(e) => setGroupby(e)}
        getTo={(e) => setTo(e)}
        getFrom={(e) => setFrom(e)}
      /> */}
      <div className="d-flex flex-column mb-5 mt-5 mx-5">
        <table className="table table-hover shadow" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border shadow py-2"
                    style={{
                      background: "#f3f4f6",
                      color: "black",
                      paddingLeft: "12px",
                    }}
                  >
                    {column.render("Header")}
                    {/* Render the columns filter UI */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "🔽"
                          : "🔼"
                        : ""}
                    </span>
                    <div className="">
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: "left",
                }}
              >
                {/* <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              /> */}
              </th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className="border  "
                        style={{
                          textDecorationLine: "none",
                          paddingLeft: "7px",
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            ⬅ Previous
          </button>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            NextPage ➡
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
