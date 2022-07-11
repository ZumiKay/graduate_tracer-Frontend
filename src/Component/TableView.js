import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, {  useState } from 'react'

const TableView = ({data , answers}) => {
    const [page , setPage] = useState(0)
    const [rowPerPage , setRowPerPage] = useState(10)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      const handleChangeRowsPerPage = (event) => {
        setRowPerPage(+event.target.value);
        setPage(0);
      };
    
    
  return (
   <Paper sx={{width: '80%', overflow: 'hidden' }}>
    <TableContainer sx={{maxHeight: 500}}>
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {data.contents?.map((item , index) => (
                    <TableCell
                    key={index}
                    align={'center'}
                    style={{fontSize:"medium" , fontWeight:"900"}}
                    >
                        {item.Question}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    answers.slice(page * rowPerPage , page * rowPerPage + rowPerPage)
                    .map((ans , index) => {
                        return (
                            <TableRow role="checkbox" tabindex={-1} key={ans._id}>
                                {ans.Responses.map((i , index1) => {
                                  
                                    if(i.type !== 'Checkbox') {
                                        return (
                                            <TableCell key={index1} align="center">
                                                
                                                    {i.response.toString()}
                                        </TableCell>
                                        )
                                    } else {
                                        return (
                                            <TableCell key={index1} align="center">
                                                {i.response.map((Ans , index2) => {
                                                    if(Ans[`ans${index2}`].isChecked === true) {
                                                        return <p>{Ans[`ans${index2}`].value}</p>
                                                    }
                                                })}
                                            </TableCell>
                                        )
                                     
                                    }
                                })}

                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>

    </TableContainer>
    <TablePagination
    rowsPerPageOptions={[10 , 25, 100]}
    component="div"
    count={answers.length}
    rowsPerPage={rowPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    />

   </Paper>
  )
}

export default TableView