import React, { useEffect, useState } from 'react';
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
    Button, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContactForm from '../ContactForm'

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactUpdate, setContactUpdate] = useState<Contact | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'update'>('add');
    const fetchUrl = 'http://localhost:4000/contacts';

    const handleGetCall = () => {
        fetch(`${fetchUrl}`)
            .then(response => response.json())
            .then(data => setContacts(data))
            .catch(err => console.error('Error', err));
    }
    const handleDeleteCall = (id: number) => {
        fetch(`${fetchUrl}/${id}`, {
            method: 'Delete',
        })
            .then(handleGetCall)
            .catch(err => console.error('Error', err));
    }
    const handlePutCall = (updatedContacts: Contact) => {
        const existingContact = contacts.find(contact => contact.id === updatedContacts.id);
        setShowModal(false);
        setContactUpdate(null);
        setAction('add');
        if (existingContact && !isContactUpdated(existingContact, updatedContacts)) {
            fetch(`${fetchUrl}/${updatedContacts.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedContacts),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
                .then(handleGetCall)
                .catch(err => console.error('Error', err));
        }
    }
    const handePostCall = (newContact: Contact) => {
        setShowModal(false);
        const getLatestId = contacts.reduce((maxId, contact) => Math.max(maxId, contact.id), 0);
        const newContactWithID = { ...newContact, id: getLatestId + 1 };
        fetch(`${fetchUrl}`, {
            method: 'POST',
            body: JSON.stringify(newContactWithID),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then(handleGetCall)
            .catch(err => console.error('Error', err));
    }
    const handleAddClick = () => {
        setShowModal(true);
    }
    const handleHomeClick = () => {
        setShowModal(false);
    }
    const handleUpdateClick = (contact: Contact) => {
        setContactUpdate(contact);
        setAction('update');
        setShowModal(true);
    }
    const isContactUpdated = (existingContact: Contact, updatedContacts: Contact) => {
        return existingContact.name === updatedContacts.name &&
            existingContact.email === updatedContacts.email &&
            existingContact.phone === updatedContacts.phone &&
            existingContact.address === updatedContacts.address;
    }
    useEffect(() => {
        handleGetCall();
    }, []);
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    return (
        <Stack spacing={2}>
            <Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>Contact Management System</h1>
                </div>
            </Item>
            {contacts.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Item>
                        <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', backgroundColor: '#6c757d' }}>
                            <Typography sx={{ minWidth: 100 }}><Button sx={{ color: '#000' }} onClick={() => handleHomeClick()} aria-label="home">Home</Button></Typography>
                            <Typography sx={{ minWidth: 100 }}><Button sx={{ color: '#000' }} onClick={() => handleAddClick()} aria-label='addnew'>Create</Button></Typography>
                        </Box>
                    </Item>
                    <Item><Paper elevation={5}>
                        {showModal && <ContactForm setShowModal={setShowModal} action={action} openModal={showModal} contactToUpdate={contactUpdate} onSubmit={action === 'add' ? handePostCall : handlePutCall} />}
                        <TableContainer >
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
                </>
            )}
        </Stack>
    );
}

export { ContactList };