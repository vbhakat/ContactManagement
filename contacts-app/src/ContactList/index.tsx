import React, { useEffect, useState, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Stack,
    styled,
    Box,
    Typography,
    Button, CircularProgress,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContactForm from '../ContactForm';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const fetchUrl = 'http://localhost:4000/contacts';

const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactUpdate, setContactUpdate] = useState<Contact | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'update'>('add');
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [showActionResponse, setShowActionResponse] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

    const isContactUpdated = useCallback((existingContact: Contact, updatedContacts: Contact) => {
        return existingContact.name === updatedContacts.name &&
            existingContact.email === updatedContacts.email &&
            existingContact.phone === updatedContacts.phone &&
            existingContact.address === updatedContacts.address;
    }, []);
    const handleGetCall = useCallback(async () => {
        try {
            const response = await fetch(fetchUrl);
            const data = await response.json();
            if (data.length > 0) {
                setContacts(data);
                setShowErrorMessage(false);
            } else {
                setContacts([]);
                setShowErrorMessage(true);
            }
        } catch (err) {
            setShowErrorMessage(true);
            console.error('Error', err);
        }
    }, []);

    const handleDeleteCall = useCallback(async (id: number) => {
        try {
            const response = await fetch(`${fetchUrl}/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            setShowActionResponse({ visible: true, message: data.message });
            handleGetCall();
        } catch (err) {
            console.error('Error', err);
        }
    }, [handleGetCall]);

    const handlePutCall = useCallback(async (updatedContacts: Contact) => {
        const existingContact = contacts.find(contact => contact.id === updatedContacts.id);
        setShowModal(false);
        setContactUpdate(null);
        setAction('add');
        if (existingContact && !isContactUpdated(existingContact, updatedContacts)) {
            try {
                const response = await fetch(`${fetchUrl}/${updatedContacts.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedContacts),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const data = await response.json();
                setShowActionResponse({ visible: true, message: data.message });
                handleGetCall();
            } catch (err) {
                console.error('Error', err);
            }
        }
    }, [contacts, handleGetCall, isContactUpdated]);

    const handePostCall = useCallback(async (newContact: Contact) => {
        setShowModal(false);
        const getLatestId = contacts.reduce((maxId, contact) => Math.max(maxId, contact.id), 0);
        const newContactWithID = { ...newContact, id: getLatestId + 1 };
        try {
            const response = await fetch(fetchUrl, {
                method: 'POST',
                body: JSON.stringify(newContactWithID),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            setShowActionResponse({ visible: true, message: data.message });
            handleGetCall();
        } catch (err) {
            console.error('Error', err);
        }
    }, [contacts, handleGetCall]);

    const handleAddClick = useCallback(() => {
        setShowModal(true);
    }, []);

    const handleHomeClick = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleUpdateClick = useCallback((contact: Contact) => {
        setContactUpdate(contact);
        setAction('update');
        setShowModal(true);
    }, []);

    const handleSnackBarClose = useCallback(() => {
        setShowActionResponse({ visible: false, message: '' });
    }, []);    

    useEffect(() => {
        handleGetCall();
    }, [handleGetCall]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <>
            <Snackbar
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                open={showActionResponse.visible}
                autoHideDuration={1000}
                onClose={handleSnackBarClose}
                message={showActionResponse.message}
            />
            <Stack spacing={2}>
                <Item>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h1>Contact Management System</h1>
                    </div>
                </Item>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', backgroundColor: '#6c757d' }}>
                        <Typography sx={{ minWidth: 100 }}><Button sx={{ color: '#000' }} onClick={handleHomeClick} aria-label="home">Home</Button></Typography>
                        <Typography sx={{ minWidth: 100 }}><Button sx={{ color: '#000' }} onClick={handleAddClick} aria-label='addnew'>Create</Button></Typography>
                    </Box>
                </Item>
                {showModal && <ContactForm setShowModal={setShowModal} action={action} openModal={showModal} contactToUpdate={contactUpdate} onSubmit={action === 'add' ? handePostCall : handlePutCall} />}
                {contacts.length === 0 && (
                    <>
                        {!showErrorMessage && (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        )}
                        {showErrorMessage && (
                            <Paper elevation={5}>
                                <Typography variant="overline" display="block" sx={{ display: 'flex', justifyContent: 'center' }} gutterBottom>
                                    No Contacts can be found
                                </Typography>
                            </Paper>
                        )}
                    </>
                )}
                {contacts.length > 0 && (
                    <Item><Paper elevation={5}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Email</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Phone</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Address</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Update</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contacts.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.email}</TableCell>
                                            <TableCell align="right">{row.phone}</TableCell>
                                            <TableCell align="right">{row.address}</TableCell>
                                            <TableCell align="right"><IconButton aria-label="edit" onClick={() => handleUpdateClick(row)}>
                                                <EditIcon />
                                            </IconButton></TableCell>
                                            <TableCell align="right"><IconButton aria-label="delete" onClick={() => handleDeleteCall(row.id)} >
                                                <DeleteIcon />
                                            </IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    </Item>
                )}
            </Stack>
        </>
    );
}

export { ContactList };
