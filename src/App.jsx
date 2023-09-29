import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { grey } from '@mui/material/colors';

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'type',
    label: 'Type',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'hp',
    label: 'Health',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'attack',
    label: 'Attack',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'defense',
    label: 'Defense',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'special_attack',
    label: 'special_attack',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'special_defense',
    label: 'special_defense',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'speed',
    label: 'Speed',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'power', // New column for Power
    label: 'Power',
    minWidth: 100,
    align: 'right',
  },
];

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [minPower, setMinPower] = useState(null);
  const [maxPower, setMaxPower] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [threshold, setThreshold] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Reset minPower and maxPower when changing pages
    setMinPower(null);
    setMaxPower(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    // Reset minPower and maxPower when changing rows per page
    setMinPower(null);
    setMaxPower(null);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
    // Reset minPower and maxPower when searching
    setMinPower(null);
    setMaxPower(null);
  };

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
    setPage(0);
    // Reset minPower and maxPower when changing the threshold
    setMinPower(null);
    setMaxPower(null);
  };

  useEffect(() => {
    // Fetch data from the JSON file when the component mounts
    fetch('../public/pokemon.json') // Assuming the JSON file is in the public folder
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const cellStyle = {
    padding: '13px',
    fontSize: '16px',
    lineHeight: '1',
  };

  // Filter data by name
  const filteredDataByName = data.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter data by threshold
  const filteredDataByThreshold = threshold
    ? filteredDataByName.filter((row) => {
        const power =
          row.hp +
          row.attack +
          row.defense +
          row.special_attack +
          row.special_defense +
          row.speed;
        return power >= Number(threshold);
      })
    : filteredDataByName;

  return (
    <div>
      <Card variant="outlined" style={{ marginBottom: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', border: '1px solid #e0e0e0' }}>
        <CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchText}
          onChange={handleSearchTextChange}
          fullWidth
          style={{ marginRight: '8px' }}
        />
        <TextField
          label="Search by Power Threshold"
          variant="outlined"
          value={threshold}
          onChange={handleThresholdChange}
          fullWidth
        />
        
      </div>
      <div>
          <p>Minimum Power: {minPower}</p>
          <p>Maximum Power: {maxPower}</p>
        </div>
        </CardContent>
        </Card>
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f4f6f8' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: '#f4f6f8', ...cellStyle }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataByThreshold
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const power =
                    row.hp +
                    row.attack +
                    row.defense +
                    row.special_attack +
                    row.special_defense +
                    row.speed;
                  if (minPower === null || power < minPower) {
                    setMinPower(power);
                  }
                  if (maxPower === null || power > maxPower) {
                    setMaxPower(power);
                  }
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = column.id === 'power' ? power : row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={cellStyle}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
       
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredDataByThreshold.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default App;
