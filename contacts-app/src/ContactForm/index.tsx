import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    AlertTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
export interface ContactFormProps {
    contactToUpdate: Contact | null;
    onSubmit: (contact: Contact) => void;
    openModal: boolean;
    action: string;
    setShowModal: (show: boolean) => void;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ setShowModal, openModal, contactToUpdate, onSubmit, action }) => {
    const [contact, setContact] = useState<Contact>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [trimmedContact, setTrimmedContact] = useState<Contact>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [alert, setAlert] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        phone: false,
        address: false
    });

    const [helperTexts, setHelperTexts] = useState({
        name: 'Please enter Contact\'s Name',
        email: 'Please enter Contact\'s Email',
        phone: 'Please enter Contact\'s Phone Number',
        address: 'Please enter Contact\'s Address'
    });

    useEffect(() => {
        if (contactToUpdate) {
            setContact(contactToUpdate);
        }
    }, [contactToUpdate]);

    const validateName = (name: string) => {
        return name.trim().length > 0;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateAddress = (address: string) => {
        return address.trim().length > 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContact({ ...contact, [name]: value });
        let valid = true;

        switch (name) {
            case 'name':
                valid = validateName(value);
                setErrors((prevErrors) => ({ ...prevErrors, name: !valid }));
                setHelperTexts((prevHelperTexts) => ({
                    ...prevHelperTexts,
                    name: valid ? 'Please enter Contact\'s Name' : 'Name cannot be empty'
                }));
                break;
            case 'email':
                valid = validateEmail(value);
                setErrors((prevErrors) => ({ ...prevErrors, email: !valid }));
                setHelperTexts((prevHelperTexts) => ({
                    ...prevHelperTexts,
                    email: valid ? 'Please enter Contact\'s Email' : 'Invalid email address'
                }));
                break;
            case 'phone':
                valid = validatePhone(value);
                setErrors((prevErrors) => ({ ...prevErrors, phone: !valid }));
                setHelperTexts((prevHelperTexts) => ({
                    ...prevHelperTexts,
                    phone: valid ? 'Please enter Contact\'s Phone Number' : 'Invalid phone number. Must be 10 digits.'
                }));
                break;
            case 'address':
                valid = validateAddress(value);
                setErrors((prevErrors) => ({ ...prevErrors, address: !valid }));
                setHelperTexts((prevHelperTexts) => ({
                    ...prevHelperTexts,
                    address: valid ? 'Please enter Contact\'s Address' : 'Address cannot be empty'
                }));
                break;
        }
    };
    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTrimmedContact({ ...contact, [name]: typeof(value)==='string'?value.trim():value });
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateName(contact.name);
        const isEmailValid = validateEmail(contact.email);
        const isPhoneValid = validatePhone(contact.phone);
        const isAddressValid = validateAddress(contact.address);

        setErrors({
            name: !isNameValid,
            email: !isEmailValid,
            phone: !isPhoneValid,
            address: !isAddressValid,
        });

        setHelperTexts({
            name: isNameValid ? 'Please enter Contact\'s Name' : 'Name cannot be empty',
            email: isEmailValid ? 'Please enter Contact\'s Email' : 'Invalid email address',
            phone: isPhoneValid ? 'Please enter Contact\'s Phone Number' : 'Invalid phone number. Must be 10 digits.',
            address: isAddressValid ? 'Please enter Contact\'s Address' : 'Address cannot be empty',
        });

        if (isNameValid && isEmailValid && isPhoneValid && isAddressValid) {
            onSubmit(trimmedContact);
        } else {
            setAlert({ visible: true, message: 'Please fix the validation errors before submitting.' });
        }
    };
    const onClose = () => {
        setShowModal(false);
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={openModal}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {alert.visible && (
                    <Alert severity="error" onClose={() => setAlert({ visible: false, message: '' })}>
                        <AlertTitle>Error</AlertTitle>
                        {alert.message}
                    </Alert>
                )}
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ display: 'flex', justifyContent: 'center' }}>
                    Contact Form
                </Typography>
                <Box id="modal-modal-description" sx={{ mt: 2 }}>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1 },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            fullWidth
                            type='text'
                            name="name"
                            value={contact.name}
                            onChange={handleInputChange}
                            onBlur={handleOnBlur}
                            placeholder="Name"
                            variant="filled"
                            error={errors.name}
                            helperText={helperTexts.name}
                        />
                        <TextField
                            fullWidth
                            type='email'
                            name="email"
                            value={contact.email}
                            onChange={handleInputChange}
                            onBlur={handleOnBlur}
                            placeholder="Email"
                            variant="filled"
                            error={errors.email}
                            helperText={helperTexts.email}
                        />
                        <TextField
                            fullWidth
                            type='text'
                            name="phone"
                            value={contact.phone}
                            onChange={handleInputChange}
                            onBlur={handleOnBlur}
                            placeholder="Phone"
                            variant="filled"
                            error={errors.phone}
                            helperText={helperTexts.phone}
                        />
                        <TextField
                            fullWidth
                            type='text'
                            name="address"
                            value={contact.address}
                            onChange={handleInputChange}
                            onBlur={handleOnBlur}
                            placeholder="Address"
                            variant="filled"
                            error={errors.address}
                            helperText={helperTexts.address}
                        />
                        <Button type='submit' variant="contained" color="primary">
                            {action === 'add' ? 'Add New Contact' : 'Update Contact'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>

    );
};

export default ContactForm;
