import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import { DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createApiInstance from '../utils/api';
import TextField from '@mui/material/TextField';
import EventIcon from '@mui/icons-material/Event';
import moment from 'moment-timezone';


import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatHeader(header, row) {
    if (header.includes("_")) {
        return header.split('_').map(capitalizeFirstLetter).join(' ');
    }
    return header
}

function JsonTable({
    jsonData,
    columnsToShow,
    tooltipMap,
    actionsToShow = {},
    userId,
    accessToken,
    onClickPage,
    clickable,
    headersDisplayedAs,
    agent,
    setToRefreshAfterDelete,
    dateColumns
}) {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteApiUrl, setDeleteApiUrl] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = React.useState(dayjs());

    const api = createApiInstance(accessToken);


    const handleDateTimeChange = (newDateTime) => {
        // Handle the date-time change if needed
        setSelectedDateTime(newDateTime);
    };

    const handleDateTimeSubmit = async (batchId, selectedDateTime, agentId) => {
        try {
            const formData = new FormData();
            formData.append('agent_id', agentId);
            formData.append('batch_id', batchId);
            formData.append('scheduled_at', moment(new Date(selectedDateTime)).format());

            const response = await api.post('/batches/schedule', formData);

            if (response.status === 200) {
                console.log('Date & Time updated successfully');
                // You can add additional logic or feedback here
            } else {
                console.error('Failed to update Date & Time');
                // Handle the error or provide feedback to the user
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Close the upload dialog
            window.location.reload();
        }
    };


    const handleDelete = async (e, accessToken, keyUuid, apiUrl, agentId) => {
        e.stopPropagation();
        try {
            let resourceId = keyUuid;
            if (apiUrl === '/batches') {
                resourceId = `${agentId}-${keyUuid}`;
            }
            const response = await api.delete(`${apiUrl}/${resourceId}`);

            if (response.data.state === "success") {
                setToRefreshAfterDelete(true);
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error while deleting:', error);
        } finally {
            // Close the delete confirmation dialog
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
            setDeleteApiUrl(null);
        }
    };

    const handleDeleteClick = (e, keyUuid, apiUrl) => {
        // Show the delete confirmation dialog
        e.stopPropagation();
        setDeleteDialogOpen(true);
        setDeleteTarget(keyUuid);
        setDeleteApiUrl(apiUrl);
    };

    const handleDeleteDialogClose = () => {
        // Close the delete confirmation dialog without deleting
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
        setDeleteApiUrl(null);
    };

    const handleRowClick = (row, agentId) => {
        if (clickable) {
            if (onClickPage === "agent-details") {
                navigate("/dashboard/agent-details", {
                    state: {
                        userId: userId,
                        agent: row
                    }
                });
            } else if (onClickPage === "run-details") {
                console.log(`Row ${JSON.stringify(row)}`)
                navigate("/dashboard/agent/run-details", {
                    state: {
                        runDetails: row
                    }
                });
            } else if (onClickPage === "batch-details") {
                console.log(`Row ${JSON.stringify(row)}`)
                navigate("/dashboard/agent/batch-details", {
                    state: {
                        agentId: agentId,
                        runDetails: row
                    }
                });
            }
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', backgroundColor: '#fff' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {headersDisplayedAs.map((column) => (
                            <TableCell key={column} sx={{ fontWeight: 'bold', color: 'grey[900]' }}>
                                {formatHeader(column, jsonData[0])}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jsonData.map((row, index) => (
                        <TableRow onClick={() => handleRowClick(row, agent)} key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:nth-of-type(even)': { backgroundColor: '#fff' }, '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#e0e0e0' } }}>
                            {columnsToShow.map((column) => {
                                var name = row[column] == undefined ? "" : row[column]
                                if (dateColumns != undefined && dateColumns.includes(column)) {
                                    const options = {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    };
                                    var d = new Date(name)
                                    name = new Date(name).toLocaleDateString(undefined, options)
                                }
                                if (tooltipMap && column in tooltipMap) {
                                    return (
                                        <Tooltip key={column} title={moment(row[tooltipMap[column]]).tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm ZZ')} disableInteractive>
                                            <TableCell key={column}>{name.toString()}</TableCell>
                                        </Tooltip>
                                    )
                                } else {
                                    return (
                                        <TableCell key={column}>{name.toString()}</TableCell>
                                    )
                                }
                            })}

                            {Object.entries(actionsToShow).map(([key, value]) => {
                                return (
                                    <TableCell key={row[value]}>

                                        {/* Render content for "Delete" */}
                                        {key === 'Delete' && (
                                            <IconButton onClick={(event) => handleDeleteClick(event, row[value.id], value.url)} aria-label={`${key} ${row[value.id]}`} sx={{ flexDirection: 'column' }}>
                                                <DeleteIcon />
                                                <Typography variant="caption">Delete</Typography>
                                            </IconButton>
                                        )}

                                        {/* Render content for "Schedule" */}
                                        {key === 'Schedule' && (

                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={{ okButtonLabel: 'Schedule' }}
                                            >

                                                {row[value.scheduled_at] !== '' ? (
                                                    <DateTimePicker
                                                        label="Schedule"
                                                        defaultValue={dayjs(row[value.scheduled_at])}
                                                        onChange={handleDateTimeChange}
                                                        onAccept={() => handleDateTimeSubmit(row[value.id], selectedDateTime, agent)}
                                                        disablePast={true}
                                                        slotProps={{
                                                            actionBar: {
                                                                actions: ["cancel", "accept"]
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <DateTimePicker
                                                        label="Schedule"
                                                        onChange={handleDateTimeChange}
                                                        onAccept={() => handleDateTimeSubmit(row[value.id], selectedDateTime, agent)}
                                                        disablePast={true}
                                                        slotProps={{
                                                            actionBar: {
                                                                actions: ["cancel", "accept"]
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </LocalizationProvider>
                                        )}
                                    </TableCell>
                                );
                            })}

                            {/* Delete confirmation dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={(event) => handleDelete(event, accessToken, deleteTarget, deleteApiUrl, agent)} color="primary" autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default JsonTable;
