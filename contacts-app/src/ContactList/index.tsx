import React,{useEffect,useState} from 'react';
import ContactForm from '../ContactForm'

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ContactList: React.FC=()=>{
    const [contacts,setContacts]=useState<Contact[]>([]);
    const [contactUpdate,setContactUpdate]=useState<Contact|null>(null);
    const [showModal,setShowModal]=useState<boolean>(false);
    const [action,setAction]=useState<'add'|'update'>('add');
    const fetchUrl='http://localhost:4000/contacts';
    
    const handleGetCall=()=>{
        fetch(`${fetchUrl}`)
        .then(response=>response.json())
        .then(data=>setContacts(data))
        .catch(err => console.error('Error',err));
    } 
    const handleDeleteCall=(id:number)=>{
        fetch(`${fetchUrl}/${id}`,{
            method:'Delete',
        })
        .then( handleGetCall)
        .catch(err => console.error('Error',err));
    }
    const handlePutCall=(contacts:Contact)=>{
        setShowModal(false);
        setContactUpdate(null);
        setAction('add');
        fetch(`${fetchUrl}/${contacts.id}`,{
            method:'PUT',
            body:JSON.stringify(contacts),
            headers:{
                'Content-type':'application/json; charset=UTF-8',
            }
        })
        .then( handleGetCall)
        .catch(err => console.error('Error',err));
    }
    const handePostCall=(newContact:Contact)=>{
        setShowModal(false);
        const getLatestId=contacts.reduce((maxId,contact)=>Math.max(maxId,contact.id),0);
        const newContactWithID={...newContact,id:getLatestId+1};
        fetch(`${fetchUrl}`,{
            method:'POST',
            body:JSON.stringify(newContactWithID),
            headers:{
                'Content-type':'application/json; charset=UTF-8',
            }
        })
        .then( handleGetCall)
        .catch(err => console.error('Error',err));
    }
    const handleAddClick = () =>{        
        setShowModal(true);
    }
    const handleUpdateClick=(contact:Contact) =>{
        setContactUpdate(contact);
        setAction('update');
        setShowModal(true);
    }
    useEffect(()=>{
        handleGetCall();
    },[]);
    return(
        <>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {contacts.map((contact)=>(
                    <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                        <td>{contact.address}</td>
                        <td><button onClick={()=>handleDeleteCall(contact.id)}>Delete this Contact</button> </td>
                        <td><button onClick={()=>handleUpdateClick(contact)}>Edit this Contact</button> </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button onClick={()=>handleAddClick()}>Add New Contacts</button> 
        {showModal && <ContactForm contactToUpdate={contactUpdate} onSubmit={action==='add'?handePostCall:handlePutCall}/>}       
        </>
    );
}

export {ContactList};